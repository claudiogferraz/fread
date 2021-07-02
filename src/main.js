const gi = require('node-gtk')
const GLib = gi.require('GLib', '2.0')
const Gtk = gi.require('Gtk', '4.0')
const window = require('./window')


const loop = GLib.MainLoop.new(null, false)
const app = new Gtk.Application('com.github.romgrk.node-gtk.demo', 0)
app.on('activate', onActivate)
const status = app.run([])

console.log('Finished with status:', status)

function onActivate() {
  gi.startLoop()
  Gtk.init()
  window.createWindow(app, onQuit)
  loop.run()
}

function onQuit() {
  loop.quit()
  app.quit()
  return false
}