const electron = require('electron')
const child_process = require('child_process')

class ScreenReserve {
  constructor(){}
  async move(win,side='bottom',dispID=0){
    let height = win.getBounds().height
    let displays = electron.screen.getAllDisplays()
    let disp = displays[dispID] || displays[0]
    let y = side=='bottom'?(disp.bounds.y+disp.bounds.height-height):disp.bounds.y
    let bounds = { 
        x: disp.bounds.x, 
        y: y, 
        width: disp.bounds.width, 
        height: height, 
        get left () { return this.x },
        get top () { return this.y },        
        get right () { return this.x + this.width },
        get bottom () { return this.y + this.height }
    }
    win.setBounds(bounds)
    console.log('displays',displays)
    console.log('bounds',bounds)
    let ropts = {}
    ropts.side = side
    ropts.win = win
    ropts.bounds = bounds
    ropts.wid = win.getNativeWindowHandle().readUInt32LE()
    ropts[side] = height
    ropts[`${side}_start_x`] = bounds.x
    ropts[`${side}_end_x`] = bounds.x+bounds.width
    await this.reserve(ropts)
    console.log(ropts.bounds)
    {
        const { x, y, width, height } = ropts.bounds
        win.setBounds({ x, y, width, height })
    }
  }
  async reserve(opts){
    this.lastOpts = opts
    if (process.platform === 'linux') {
        let keys = ['left', 'right', 'top', 'bottom', 'left_start_y', 'left_end_y', 'right_start_y', 'right_end_y', 'top_start_x', 'top_end_x', 'bottom_start_x','bottom_end_x']
        keys.forEach(k=>opts[k] = opts[k] || 0)
        let val1 = keys.map(k=>opts[k] || 0).join(',')
        let val2 = keys.map(k=>opts[k] || 0).slice(0,4).join(',')
        console.log('xprop keys',keys.join(','))
        console.log('xprop vals',val1)
        let child1 = child_process.spawn('xprop',['-id',opts.wid,'-f','_NET_WM_STRUT_PARTIAL','32c','-set','_NET_WM_STRUT_PARTIAL',val1])
        let child2 = child_process.spawn('xprop',['-id',opts.wid,'-f','_NET_WM_STRUT','32c','-set','_NET_WM_STRUT',val2])
    }
    if (process.platform === 'win32') {
        const cmd = (cmd) => {
            return spawnJSON(`${__dirname}/tools.exe`, [cmd, opts.wid, opts.bounds.left, opts.bounds.top, opts.bounds.right, opts.bounds.bottom, opts.side])
        }
        if (!this.registered) {
            const abd = cmd('ADD')
            this.registered = abd.uCallbackMessage
            opts.win.hookWindowMessage(this.registered, (msg) => {
                console.log(msg)
                if(msg[0] === 1) { // POSCHANGED
                    this.reserve(this.lastOpts)
                }
            })
            opts.win.on('close', async () => {
                opts.win.unhookWindowMessage(this.registered)
                cmd('REMOVE')
            })
        }
        let abd = { rc: { bottom: 0 } } 
        do {
            abd = cmd('QUERY')
            opts.bounds.y = abd.rc.bottom - opts.bounds.height
        } while(abd.rc.bottom !== opts.bounds.bottom)
        cmd('SET')
        {
            const { x, y, width, height } = opts.bounds
            const lastBounds = opts.win.getBounds()
            if (lastBounds.x !== x || lastBounds.y != y || lastBounds.width != width || lastBounds.height != height) {
                setTimeout(() => opts.win.setBounds({ x, y, width, height }), 100)
            }
        }
    }
  }
}

function spawnJSON(cmd, args, opts) {
    cmd = cmd.replace("app.asar", "app.asar.unpacked")
    const child = child_process.spawnSync(cmd, args, opts)
    let output = child.stdout.toString()
    console.log(output)
    return JSON.parse(output)
}

module.exports = ScreenReserve