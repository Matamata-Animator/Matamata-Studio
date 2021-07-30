import { applyTheme, getThemes, setTheme } from "../themes";
import jQuery from "jquery";

import Swal from "sweetalert2";
import Store from "electron-store";
const store = new Store();

applyTheme();

function themeSettings() {
  Swal.fire({
    title: "Choose a theme",
    html: `
        <select id="themeSelect" class='swal2-input' name="theme"">
          ${getThemeSettings()} 
        </select>
    `,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: () => {
      let theme =
        Swal.getPopup()!.querySelector<HTMLSelectElement>(
          "#themeSelect"
        )!.value;
      return theme;
    },
  }).then((theme) => {
    setTheme(theme.value as string);
    // setTheme(String(theme));
  });
}

function getThemeSettings() {
  let themes = getThemes();
  let options = "";

  jQuery.each(themes, (k, v) => {
    k = k as string;
    options += `<option value="${k}">${k}</option>`;
  });
  // for (const [k, v] of store.get("renderDefaults")) {
  //   options += `<option value="${k}">${k}</option>`;
  // }
  return options;
}
