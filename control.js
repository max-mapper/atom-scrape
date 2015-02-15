var ipc = require('ipc')

ipc.send('control-ready', {width: screen.width, height: screen.height})
