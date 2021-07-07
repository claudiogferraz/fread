const gi = require('node-gtk');
const Gtk = gi.require('Gtk', '4.0')

module.exports = class Word extends Gtk.Label {
  constructor(word) {
    super()
    this.label = word
    this.vexpand = true
    this.addCssClass('large-title')
  }
  setReadingFont() {
    this.addCssClass('title-1')
  }
  removeReadingFont() {
    this.removeCssClass('title-1')
  }
}