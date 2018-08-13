const {app, BrowserWindow} = require('electron')

const ScreenReserve = require('../')

let defaultPos = { x:0, y:0, width: 100, height: 32 }
let screenReserve = new ScreenReserve()
// screenReserve.findPos(defaultPos)

let win


function createWindow () {
  win = new BrowserWindow({
    width: 800, 
    height: 32,
    type: process.platform === 'win32' ? 'toolbar' : 'dock',
    frame: false
  })
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
  screenReserve.move(win,'bottom',1)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})