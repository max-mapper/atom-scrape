var fs = require('fs')
var path = require('path')
var app = require('app')
var ipc = require('ipc')
var BrowserWindow = require('browser-window')

var pesticide = fs.readFileSync(__dirname + '/style/pesticide.css').toString()
var clientJS = fs.readFileSync(__dirname + '/client.js').toString()

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

var win = {}

app.on('ready', function() {
  win.control = new BrowserWindow({width: 500, height: 200 })
  win.site = new BrowserWindow({
    width: 800,
    height: 600,
    preload: path.resolve(path.join(__dirname, 'preload.js')),
    "web-preferences": {
      "web-security": true
    }
  })
  win.control.loadUrl('file://' + __dirname + '/control.html')
  var site = 'http://en.wikipedia.org/wiki/Comparison_of_single-board_computers'

  win.site.loadUrl(site)  
  win.site.webContents.on('did-finish-load', function(e, url) {
    win.site.webContents.insertCSS(pesticide)
    win.site.webContents.executeJavaScript(clientJS)
  })
  
  win.site.webContents.on('will-navigate', function(e, url) {
    console.log('will-navigate ' + url)
  })
})

ipc.on('control-ready', function(event, dims) {
  var smallWidth = ~~(dims.width * .25)
  var largeWidth = ~~(dims.width * .75)
  
  win.control.setSize(smallWidth, dims.height)
  win.control.setPosition(0, 0)
  win.site.setSize(largeWidth, dims.height)
  win.site.setPosition(smallWidth, 0)
})

ipc.on('site-ready', function(event, dims) {
  console.log('got site ready!')
})
