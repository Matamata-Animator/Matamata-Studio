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
    setDefaults();
  }
}

const renderDefaults = {
  audio: null,
  timestamps: null,
  text: null,
  output: null,
  offset: null,

  character: null,
  mouths: null,

  dimensions: null,
  dimension_scaler: null,

  emotion_detection_env: null,

  codec: "",

  transcriber: "vosk",
  watson_api_key: null,

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
