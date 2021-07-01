imports.gi.versions.Gtk = "4.0";
const { Gtk, GLib } = imports.gi;

let app = new Gtk.Application({ application_id: 'codes.gomes.gready' });

app.connect('activate', () => {

  let state = {
    defaultPhrase: "Press play when you're ready",
    isReading: 0,
    textWords: ["No", "text"],
    renderedTextPos: -1,
    wordsPerMinute: 265
  }

  let header = () => {
    let textButton = new Gtk.ToggleButton({ iconName: "text-editor-symbolic" });
    textButton.set_tooltip_text("Set the text you'll read.");
    let header = new Gtk.HeaderBar();
    header.pack_start(textButton);
    return header;
  }

  let text = () => {
    let text = new Gtk.Label({vexpand: true});
    text.add_css_class("large-title");
    text.set_text(state.defaultPhrase);
    return text;
  }

  let controls = (renderedText) => {
    let controls = new Gtk.Box();
    controls.add_css_class("linked");

    const startReading = () => {
      state.isReading = true;
      readingLoop();
      startButton.set_icon_name("media-playback-pause-symbolic");
      startButton.disconnect(startButtonClick);
      startButtonClick = startButton.connect('clicked', pauseReading);
    }

    const pauseReading = () => {
      state.isReading = false;
      startButton.set_icon_name("media-playback-start-symbolic");
      startButton.disconnect(startButtonClick);
      startButtonClick = startButton.connect('clicked', startReading);
    }

    const resetReading = () => {
      pauseReading();
      state.renderedTextPos = -1;
      renderedText.set_text(state.defaultPhrase);
    }

    const readingLoop = () => {
      if (state.renderedTextPos !== state.textWords.length-1 && state.isReading === true){  
        state.renderedTextPos++;
        renderedText.set_text(state.textWords[state.renderedTextPos]);
  
        if (state.renderedTextPos === state.textWords.length-1) {
          GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000/(state.wordsPerMinute/60), resetReading);
        } else {
          GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000/(state.wordsPerMinute/60), readingLoop);
        }
      } else {
        state.isReading = false;
      }
    }

    let startButton = new Gtk.Button({ iconName: "media-playback-start-symbolic" });
    let startButtonClick = startButton.connect('clicked', startReading);
    startButton.set_tooltip_text("Start reading.");

    let resetButton = new Gtk.Button({ iconName: "edit-undo-symbolic" });
    let resetButtonClick = resetButton.connect('clicked', resetReading);
    resetButton.set_tooltip_text("Reset reading progress.");

    let prevButton = new Gtk.Button({ iconName: "go-previous-symbolic" });
    prevButton.set_tooltip_text("Back to previous word.");
    // let nextButton = new Gtk.Button({ iconName: "go-next-symbolic" });

    controls.append(prevButton);
    controls.append(startButton);
    // controls.append(nextButton);
    controls.append(resetButton);
    return controls;
  }

  let actionBar = (renderedText) => {
    let actionBar = new Gtk.ActionBar();

    actionBar.set_center_widget(controls(renderedText));

    let bookmarkButton = new Gtk.ToggleButton({ iconName: "user-bookmarks-symbolic" });
    bookmarkButton.set_tooltip_text("Bookmark word.");
    actionBar.pack_end(bookmarkButton);

    let wpmInput = new Gtk.SpinButton({
      numeric: true,
      adjustment: new Gtk.Adjustment({
        lower: 1,
        upper: 1000, 
        value: state.wordsPerMinute, 
        stepIncrement: 1, 
        pageIncrement: 1, 
      })
    });
    let wpmInputLabel = new Gtk.Label({label: "WPM "})
    actionBar.pack_start(wpmInputLabel);
    actionBar.pack_start(wpmInput);
    return actionBar;
  }

  let contentBox = () => {
    let contentBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
    let renderedText = text();
    contentBox.append(renderedText)
    contentBox.append(actionBar(renderedText))
    return contentBox;
  }
  
  let window = () => {
    let window = new Gtk.ApplicationWindow({
      application: app,
      title: "Fread",
      defaultHeight: 400,
      defaultWidth: 600
    });
    window.set_titlebar(header());
    window.set_child(contentBox());
    window.present();
  }

  window();

});

app.run([]);