const gi = require('node-gtk');
const Gtk = gi.require('Gtk', '4.0')

module.exports = class HeaderBar extends Gtk.HeaderBar {
  constructor(props) {
    super(props)

    this.textButton = new Gtk.Button({ 
      icon_name: 'text-editor-symbolic'
    })
    this.packStart(this.textButton)
  }
}