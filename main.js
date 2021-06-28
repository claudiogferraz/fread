imports.gi.versions.Gtk = "4.0";
// Imports gtk
const Gtk = imports.gi.Gtk;
const Pango = imports.gi.Pango;

let app = new Gtk.Application({ application_id: 'codes.gomes.gready' });

app.connect('activate', () => {
  let window = new Gtk.ApplicationWindow({
    application: app,
    title: "Fread",
    defaultHeight: 400,
    defaultWidth: 600
  });

  // Example of how click interactions can be used:
  // let btn = new Gtk.Button({ label: 'Close dis' });
  // btn.connect('clicked', () => { win.close(); });
  
  let header = new Gtk.HeaderBar();
  let startButton = new Gtk.Button({ iconName: "media-playback-start-symbolic" });
  header.pack_start(startButton);
  
  window.set_titlebar(header);
  
  let activeWord = new Gtk.Label();
  activeWord.add_css_class("title-1");
  activeWord.set_text("Welcome!");

  // Another way of making the text bigger:
  // let textAttr = new Pango.AttrList();
  // textAttr.insert(Pango.attr_scale_new(3));
  // text.attributes = textAttr;
  
  window.set_child(activeWord);
  window.present();
});

app.run([]);