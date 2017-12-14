const electron = require('electron')
const child_process = require('child_process')

class ScreenReserve {
  constructor(){}
  move(win,side='bottom',dispID=0){
    let height = win.getBounds().height
    let displays = electron.screen.getAllDisplays()
    let disp = displays[dispID] || displays[0]
    let y = side=='bottom'?(disp.bounds.y+disp.bounds.height-height):disp.bounds.y
    let bounds = { x: disp.bounds.x, y: y, width: disp.bounds.width, height: height }
    win.setBounds(bounds)
    console.log('displays',displays)
    console.log('bounds',bounds)
    let ropts = {}
    ropts.wid = win.getNativeWindowHandle().readUInt32LE()
    ropts[side] = height
    ropts[`${side}_start_x`] = bounds.x
    ropts[`${side}_end_x`] = bounds.x+bounds.width
    this.reserve(ropts)
  }
  reserve(opts){
    let keys = ['left', 'right', 'top', 'bottom', 'left_start_y', 'left_end_y', 'right_start_y', 'right_end_y', 'top_start_x', 'top_end_x', 'bottom_start_x','bottom_end_x']
    keys.forEach(k=>opts[k] = opts[k] || 0)
    let val = keys.map(k=>opts[k] || 0).join(',')
    console.log('xprop keys',keys.join(','))
    console.log('xprop vals',val)
    let child = child_process.spawn('xprop',['-id',opts.wid,'-f','_NET_WM_STRUT_PARTIAL','32c','-set','_NET_WM_STRUT_PARTIAL',val])
  }
}
module.exports = ScreenReserve