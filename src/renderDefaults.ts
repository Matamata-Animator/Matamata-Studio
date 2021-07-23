import Store from "electron-store";
import * as os from "os";

const store = new Store();

export function checkDefaults() {
  if (!store.has("defaults-set") || store.get("defaults-set") != true) {
    setDefaults();
  }
}

const defaults = {
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

  [Symbol.iterator]: function* () {
    let properties = Object.keys(this);
    for (let i of properties) {
      yield [i, this[i]];
    }
  },
};

function setDefaults() {
  if (os.platform() === "linux") {
    defaults.codec = "FMP4";
  }
  for (const [k, v] of defaults) {
    store.set(k, v);
  }
  store.set("defaults-set", true);
}
