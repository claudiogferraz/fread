imports.gi.versions.Gtk = "4.0";
const { Gtk, GLib } = imports.gi;

let app = new Gtk.Application({ application_id: 'codes.gomes.gready' });

app.connect('activate', () => {

  // Application default variables
  let defaultPhrase = "Press play when you're ready";
  let isReading = false;
  let words = ["No", "text", "selected"];
  let renderedWordPos = -1;
  let wordsPerMinute = 200;

  const startReading = () => {
    isReading = true;
    goForward();
    startButton.set_icon_name("media-playback-pause-symbolic");
    startButton.disconnect(startButtonClick);
    startButtonClick = startButton.connect('clicked', pauseReading);
  }

  const pauseReading = () => {
    isReading = false;
    startButton.set_icon_name("media-playback-start-symbolic");
    startButton.disconnect(startButtonClick);
    startButtonClick = startButton.connect('clicked', startReading);
  }

  const resetReading = () => {
    pauseReading();
    renderedWordPos = -1;
    renderedWord.set_text(defaultPhrase);
  }

  const goForward = () => {
    if (renderedWordPos !== words.length-1 && isReading === true) {
      
      renderedWordPos++;
      renderedWord.set_text(words[renderedWordPos]);

      if (renderedWordPos === words.length-1) {
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000/(wordsPerMinute/60), resetReading);
      } else {
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000/(wordsPerMinute/60), goForward);
      }
    } else {
      isReading = false;
    }

  }

  let startButton = new Gtk.Button({ iconName: "media-playback-start-symbolic" });
  let startButtonClick = startButton.connect('clicked', startReading);

  let resetButton = new Gtk.Button({ iconName: "edit-undo-symbolic" });
  let resetButtonClick = resetButton.connect('clicked', resetReading);

  let buttonBox = new Gtk.Box();
  buttonBox.add_css_class("linked");
  buttonBox.append(startButton);
  buttonBox.append(resetButton);

  let renderedWord = new Gtk.Label();
  renderedWord.add_css_class("large-title");
  renderedWord.set_text(defaultPhrase);
  
  let header = new Gtk.HeaderBar();
  header.pack_start(buttonBox);

  let appWindow = new Gtk.ApplicationWindow({
    application: app,
    title: "Fread",
    defaultHeight: 400,
    defaultWidth: 600
  });
  appWindow.set_titlebar(header);
  appWindow.set_child(renderedWord);
  appWindow.present();

});

app.run([]);