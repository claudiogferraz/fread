imports.gi.versions.Gtk = "4.0";
const { Gtk, GLib } = imports.gi;

let app = new Gtk.Application({ application_id: 'codes.gomes.gready' });

app.connect('activate', () => {
  
  let appWindow = new Gtk.ApplicationWindow({
    application: app,
    title: "Fread",
    defaultHeight: 400,
    defaultWidth: 600
  });

  let isReading = false;
  let wordsArr = ["First", "Second", "Third"];
  let activeWordPos = -1;
  let wordsPerMinute = 200;

  // Example of how click interactions can be used:
  // let btn = new Gtk.Button({ label: 'Close dis' });
  // btn.connect('clicked', () => { win.close(); });
  
  let header = new Gtk.HeaderBar();
  let startButton = new Gtk.Button({ iconName: "media-playback-start-symbolic" });
  startButton.connect('clicked', () => {
    if (isReading === false && activeWordPos !== wordsArr.length-1) {
      isReading = true;
      goForward();
    } else if (isReading === false && activeWordPos === wordsArr.length-1) {
      // this means he read everything and clicked to go "restart" the text
      activeWordPos = 0
      activeWord.set_text(wordsArr[activeWordPos]);
    } else {
      isReading = false;
    }
  })

  const goForward = () => {
    if (activeWordPos !== wordsArr.length-1 && isReading === true) {

      activeWordPos++;

      activeWord.set_text(wordsArr[activeWordPos]);

      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000/(wordsPerMinute/60), goForward);  
    } else {
      isReading = false;
    }

  }

  header.pack_start(startButton);
  
  appWindow.set_titlebar(header);
  
  let activeWord = new Gtk.Label();
  activeWord.add_css_class("title-1");
  activeWord.set_text("Welcome!");

  // Another way of making the text bigger:
  // let textAttr = new Pango.AttrList();
  // textAttr.insert(Pango.attr_scale_new(3));
  // text.attributes = textAttr;
  
  appWindow.set_child(activeWord);
  appWindow.present();
});

app.run([]);