import Store from "electron-store";
import fs from "fs";
import path from "path";
import jQuery from "jquery";

const store = new Store();

export function applyTheme() {
  let raw = fs.readFileSync(path.resolve(__dirname, "themes.json"));
  let themes = JSON.parse(raw.toString());
  console.log(themes);
  let currentTheme = store.get("themes.currentTheme") as string;
  console.log(currentTheme);

  let cssVars = themes[currentTheme];
  console.log(cssVars);

  jQuery.each(cssVars, (k, v) => {
    document.body.parentElement!.style.setProperty(k as string, v);
  });
  //   getComputedStyle(document.body).getPropertyValue(
  //     "--mm-waveform-color"
  //   )
}
