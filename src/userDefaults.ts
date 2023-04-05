import Store from "electron-store";
import * as os from "os";
import { autoUpdater } from "electron-updater";

const store = new Store();

export function checkDefaults() {
  if (
    !store.has("renderDefaults.defaults-set") ||
    store.get("renderDefaults.defaults-set") != true

    || !store.has('version')
    || store.get('version') != autoUpdater.currentVersion.version


  ) {
    console.log("Resseting defaults")
    setDefaults();
  }
}

const renderDefaults = {
  audio: null,
  timestamps: "build/Core/defaults/default_timestamps.txt",
  text: null,
  output: null,
  offset: null,

  character: "build/Core/defaults/SampleCharacter/characterStudio.json",
  mouths: null,

  dimensions: null,
  dimension_scaler: null,

  codec: "",

  transcriber: "vosk",
  watson_api_key: null,
  vosk_model: null,

  [Symbol.iterator]: function* () {
    let properties = Object.keys(this);
    for (let i of properties) {
      yield [i, this[i]];
    }
  },
};

function setDefaults() {
  store.clear();
  if (os.platform() === "linux") {
    renderDefaults.codec = "FMP4";
  }
  for (const [k, v] of renderDefaults) {
    store.set(`renderDefaults.${k}`, v);
  }
  store.set("renderDefaults.defaults-set", true);

  store.set("themes.currentTheme", "Dracula");
  store.set('version', autoUpdater.currentVersion.version)
}
