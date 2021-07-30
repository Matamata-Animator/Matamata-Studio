import Store from "electron-store";
import fs from "fs";
import path from "path";
import jQuery from "jquery";
import { setSyntheticTrailingComments } from "typescript";

const store = new Store();

let themes_path = path.resolve(__dirname, "themes.json");

export function applyTheme() {
  let themes = getThemes();
  console.log(themes);
  let currentTheme = store.get("themes.currentTheme") as string;
  console.log(currentTheme);

  let cssVars = themes[currentTheme];

  jQuery.each(cssVars, (k, v) => {
    document.body.parentElement!.style.setProperty(k as string, v);
  });
  //   getComputedStyle(document.body).getPropertyValue(
  //     "--mm-waveform-color"
  //   )
}

export function getThemes() {
  let raw = fs.readFileSync(themes_path);
  let themes = JSON.parse(raw.toString());
  return themes;
}

export function setTheme(theme: string) {
  store.set("themes.currentTheme", theme);
  applyTheme();
}
