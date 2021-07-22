import Store from "electron-store";
const store = new Store();

import Swal from "sweetalert2";
import { ipcRenderer } from "electron";
export function showDefaultsMenu() {
  Swal.fire({
    title: "Set Default",
    html: `
    <label for="args" >Choose an argument:</label>
    <select id="args" class='swal2-input' name="args">
      ${getFormOptions()}
    </select>

    <input type="text" id="argDefault" class="swal2-input" placeholder="Username">
`,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: () => {},
  });
}

function getFormOptions() {
  let options = "";
  for (const kv of store) {
    options += `<option value="${kv[0]}">${kv[0]}</option>`;
  }
  return options;
}
