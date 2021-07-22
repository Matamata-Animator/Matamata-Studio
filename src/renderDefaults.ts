import Store from "electron-store";
const store = new Store();

export function checkDefaults() {
  if (!store.has("defaults-set")) {
    setDefaults();
  }
}

const defaults = {
  audio: null,
  timestamps: null,
  text: null,
  output: null,
  offset: null,

  character: "defaults/characters.json",
  mouths: "defaults/phonemes.json",

  dimensions: null,
  dimension_scaler: null,

  emotion_detection_env: null,

  codec: null,

  [Symbol.iterator]: function* () {
    let properties = Object.keys(this);
    for (let i of properties) {
      yield [i, this[i]];
    }
  },
};

function setDefaults() {
  for (const [k, v] of defaults) {
    store.set(k, v);
  }
  store.set("defaults-set", true);
}
