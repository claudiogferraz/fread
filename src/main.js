imports.gi.versions.Gtk = "4.0";
const { Gtk, GLib } = imports.gi;

let app = new Gtk.Application({ application_id: 'codes.gomes.gready' });

app.connect('activate', () => {

  let state = {
    defaultPhrase: "Press play when you're ready",
    isReading: 0,
    textWords: ["No", "text"],
    renderedTextPos: -1,
    wordsPerMinute: 200,
    bookmark: -1,
  }

  let header = () => {
    let fileName = new Gtk.Label({ label: "No file selected", xalign: 0 });
    let fileButton = new Gtk.Button({ iconName: "document-open-symbolic" });
    fileButton.set_tooltip_text("Select a text file to read.");
    fileButton.connect('clicked', () => {
      let dialog = new Gtk.FileChooserDialog({
        title: "Select a text file",
        action: Gtk.FileChooserAction.OPEN
      });
      dialog.add_button("Cancel", Gtk.ResponseType.CANCEL);
      dialog.add_button("Open", Gtk.ResponseType.OK);
      dialog.connect("response", (dialog, response) => {
        if (response == Gtk.ResponseType.OK) {
          let file = dialog.get_file();
          state.fileName = file.get_path();
          fileName.set_text(state.fileName);

          let textContent = GLib.file_get_contents(state.fileName);
          // split string into words at spaces and newlines
          state.textWords = textContent.toString().split(/\s+|\n+/);
          state.renderedTextPos = 0;
          state.bookmark = -1;
        }
        dialog.close();
      });
      dialog.present();
    });

    let header = new Gtk.HeaderBar();
    header.pack_start(fileButton);
    header.pack_start(fileName);
    return header;
  };

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
      renderedText.remove_css_class("title-1");
    }

    const readingLoop = () => {
      if (state.renderedTextPos !== state.textWords.length-1 && state.isReading === true){  
        state.renderedTextPos++;
        renderedText.set_text(state.textWords[state.renderedTextPos]);
        renderedText.add_css_class("title-1");
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
    bookmarkButton.connect("toggled", () => {
      if (bookmarkButton.get_active()) {
        state.bookmark = state.renderedTextPos;
      } else {
        state.bookmark = -1;
      }
    });
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
    wpmInput.set_tooltip_text("Words per minute.");
    wpmInput.connect("value-changed", (wpmInput) => {
      state.wordsPerMinute = wpmInput.get_value();
    });

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