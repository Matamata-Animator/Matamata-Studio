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

    <input type="text" id="argDefault" class="swal2-input" value="${store.get(
      "audio"
    )}">
`,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: () => {
      //@ts-ignore
      var parameter = Swal.getPopup().querySelector("#args").value;
      //@ts-ignore
      const value = Swal.getPopup().querySelector("#argDefault").value;
      store.set(parameter, value);
    },
  });
}

function getFormOptions() {
  let options = "";
  for (const [k, v] of store) {
    options += `<option value="${k}">${k}</option>`;
  }
  return options;
}
