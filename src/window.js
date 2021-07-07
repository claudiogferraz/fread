const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '4.0')
const HeaderBar = require('./headerBar')
const Word = require('./word')

module.exports = class Window extends Gtk.ApplicationWindow {
  constructor (props) {
    super(props)
    this.setApplication(props.app)
    this.setTitle('Fread')
    this.setDefaultSize(600, 400)

    let headerBar = new HeaderBar(props.app)

    this.setTitlebar(headerBar)

    let word = new Word("Add a text to read.")
    
    this.setChild(word)
    
    this.present()
  }
}

// const open = (app, onQuit) => {
//   win.setApplication(app)
//   let onQuitFunc = onQuit;
//   win.on('close-request', ()=>{
//     onQuitFunc()
//   })
//   win.present();
// }


/*
const ugabuga = (app, onQuit) => {
  let window = new Gtk.ApplicationWindow({
    application: app,
    title: "Fread",
    default_width: 600,
    default_height: 400,
    resizable: true,
    icon_name: "fread",
  });

  let state = {
    defaultPhrase: "Press play when you're ready",
    isReading: false,
    textByteArray: [],
    spacesIndexes: [],
    renderedTextPos: -1,
    wordsPerMinute: 200,
    bookmark: -1,
    setFile: false
  }

  const indexOfAllSpaces = (arr) => {
    state.textByteArray = [];

    var x = arr.length;
  
    while (x--) {
      if (arr[x] === 10) {
        arr[x] = 32;
      } else if (arr[x] === 13) {
        arr.splice(arr.indexOf(13), 1);
      }
    }

    state.textByteArray = [...arr];
    let i = 0;
    let result = [];
    while (i < arr.length) {
      if (arr[i] === 32) {
        result.push(i);
      }
      i++;
    }
    return result;
  }

  let header = () => {
    let fileName = new Gtk.Label({ label: "No file selected"});
    let fileButton = new Gtk.Button({ icon_name: "document-open-symbolic" });
    fileButton.setTooltipText("Select a text file to read.");
    fileButton.on('clicked', () => {
      let dialog = new Gtk.FileChooserDialog({
        title: "Select a text file",
        action: Gtk.FileChooserAction.OPEN,
        transient_for: window,
      });
      dialog.setDefaultSize(600,400);
      dialog.addButton("Cancel", Gtk.ResponseType.CANCEL);
      dialog.addButton("Open", Gtk.ResponseType.OK);
      dialog.on("response", (response) => {
        if (response == Gtk.ResponseType.OK) {
          let file = dialog.getFile();
          state.fileName = file.getPath();
          fileName.setText(state.fileName);

          if (GLib.fileGetContents(state.fileName)[0] === true) {
            // state.textByteArray = GLib.fileGetContents(state.fileName)[1];
            state.setFile = true;
            state.spacesIndexes = indexOfAllSpaces(GLib.fileGetContents(state.fileName)[1]);
            state.renderedTextPos = -1;
            state.bookmark = -1;
          }
        }
        dialog.close();
      });
      dialog.show();
    });

    let header = new Gtk.HeaderBar();
    header.packStart(fileButton);
    header.packStart(fileName);
    return header;
  };

  const getActiveWord = () => {
    let wordValues = [];
    let word = "";
    if (state.renderedTextPos > 0 && state.renderedTextPos < state.spacesIndexes.length-1) {
      wordValues = state.textByteArray.slice(state.spacesIndexes[state.renderedTextPos-1], state.spacesIndexes[state.renderedTextPos]);
      for (let i=0; i < wordValues.length; i++) {
        let c = wordValues[i];
        word = word + String.fromCharCode(c);
      }
    } else {
      wordValues = state.textByteArray.slice(0, state.spacesIndexes[0]);
      for (let i=0; i < wordValues.length; i++) {
        let c = wordValues[i];
        word = word + String.fromCharCode(c);
      }
    }
    return word;
  }

  let controls = () => {
    let controls = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    controls.addCssClass("linked");
  
    const startReading = () => {
      clearTimeout(loopTimeout);
      state.isReading = true;
      if (state.setFile===true) {
        playLoop();
        text.addCssClass("title-1");
        playButton.setIconName("media-playback-pause-symbolic");
        playButton.setTooltipText("Pause reading.");
        playButton.off('clicked', startReading);
        playButton.on('clicked', pauseReading);
      }
    }

    const pauseReading = () => {
      state.isReading = false;
      clearTimeout(loopTimeout);
      playButton.setIconName("media-playback-start-symbolic");
      playButton.setTooltipText("Resume reading.");
      playButton.off('clicked', pauseReading);
      playButton.on('clicked', startReading);
    }

    const resetReading = () => {
      pauseReading();
      state.renderedTextPos = -1;
      text.setText(state.defaultPhrase);
      text.removeCssClass("title-1");
      playButton.setTooltipText("Start reading.");
    }

    const prevWord = () => {
      pauseReading();
      if (state.renderedTextPos > 0) {
        let newPos = state.renderedTextPos - 1;
        state.renderedTextPos = newPos;
        text.setText(getActiveWord());
      } else {
        resetReading();
      }
    };

    let loopTimeout;

    const playLoop = () => {
      if (state.renderedTextPos !== state.spacesIndexes.length && state.isReading === true) {
        state.renderedTextPos+=1;
        text.setText(getActiveWord());
        if (state.renderedTextPos === state.spacesIndexes.length) {
          clearTimeout(loopTimeout);
          loopTimeout = setTimeout(resetReading, 1000/(state.wordsPerMinute/60));
        } else {
          clearTimeout(loopTimeout);
          loopTimeout = setTimeout(playLoop, 1000/(state.wordsPerMinute/60));
        }
      } else {
        clearTimeout(loopTimeout);
        state.isReading = false;
        pauseReading();
      }
    }

    let prevButton = new Gtk.Button({ icon_name: "go-previous-symbolic" });
    prevButton.setTooltipText("Previous word.");
    prevButton.on('clicked', prevWord);

    let playButton = new Gtk.Button({ icon_name: "media-playback-start-symbolic" });
    playButton.setTooltipText("Start reading.");
    playButton.on('clicked', startReading);

    let resetButton = new Gtk.Button({ icon_name: "edit-clear-symbolic" });
    resetButton.setTooltipText("Reset reading progress.");
    resetButton.on('clicked', resetReading);

    controls.append(prevButton);
    controls.append(playButton);
    controls.append(resetButton);

    return controls;
  }

  const actionBar = () => {
    let actionBar = new Gtk.ActionBar();

    actionBar.setCenterWidget(controls(text));

    let bookmarkButton = new Gtk.ToggleButton({ icon_name: "bookmark-new-symbolic" });
    bookmarkButton.setTooltipText("Mark this word as a bookmark.");
    bookmarkButton.on('clicked', () => {
      if (bookmarkButton.get_active()) {
        state.bookmark = state.renderedTextPos;
      } else {
        state.bookmark = -1;
      }
    });
    actionBar.packEnd(bookmarkButton);

    let wpmInput = new Gtk.SpinButton({ adjustment: new Gtk.Adjustment({ 
      lower: 1, 
      upper: 1000,
      value: state.wordsPerMinute, 
      step_increment: 1, 
      page_increment: 1, 
      page_size: 0
    }) });
    wpmInput.setTooltipText("Words per minute.");
    wpmInput.on('value-changed', () => {
      state.wordsPerMinute = wpmInput.getValueAsInt();
    });
    let wpmLabel = new Gtk.Label({ label: "WPM " });
    actionBar.packStart(wpmLabel);
    actionBar.packStart(wpmInput);
    return actionBar;
  }

  const contentBox = () => {
    let contentBox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL});
    contentBox.append(text);
    contentBox.append(actionBar(text));
    return contentBox;
  }

  let text = new Gtk.Label({vexpand: true});
  text.addCssClass("large-title");
  text.setText(state.defaultPhrase);

  window.setTitlebar(header());
  window.setChild(contentBox());

  window.on('close-request', onQuit);

  window.present();

  return window;
};
*/