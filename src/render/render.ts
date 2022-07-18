import { rejects } from "assert";
import { ipcMain, ipcRenderer } from "electron";
import * as os from "os";
import { exit, exitCode } from "process";

import Swal from "sweetalert2";
import { getSudo } from "../getSudo";

import Store from "electron-store";
import { UrlWithStringQuery } from "url";

import * as jQuery from "jquery";

import { setCursor, applyTheme } from "../themes";

import { simplifyError } from "./errors";

applyTheme();
const store = new Store();
interface PathReturn {
  canceled: boolean;
  filePaths: string[];
}

let req = {
  
};

ipcRenderer.on("path", (ev, item: string, r: PathReturn) => {
  if (!r.canceled) {
    let path = r.filePaths[0];
    assignPath(path, item);
  }
});
ipcRenderer.on("savePath", (ev, item: string, r: any) => {
  if (!r.canceled) {
    let path = r.filePath;
    assignPath(path, item);
  }
});
function assignPath(path, item) {
  req[item] = path;
  let preview = document.getElementById(item);
  if (preview) preview.innerText = path;
}

async function uploadPath(item, options = {}) {
  // Renderer process
  ipcRenderer.send("getOpenPath", item, options);
}
async function savePath(item, options = {}) {
  // Renderer process
  ipcRenderer.send("getSavePath", item, options);
}
var running = false;

function getExtras() {
  return "";
  // let extras = document.getElementById("extras") as HTMLInputElement;
  // return extras.value;
}

async function run(command: string): Promise<string> {
  console.log(command);
  ipcRenderer.on("data", (ev, data) => {
    console.log("data", data);
  });

  let ran: Promise<string> = new Promise((resolve, reject) => {
    ipcRenderer.on("error", (ev, err) => {
      console.log("Error: ", err);
      resolve(err);
    });
    ipcRenderer.on("exit", (ev, exitCode) => {
      console.log(exitCode);
      resolve(exitCode);
    });

    ipcRenderer.send("run", command);
  });
  return ran;
}

async function render() {
  setCursor("progress");
  if (!(req["audio"] || store.get("renderDefaults.audio")) || !req["output"]) {
    setCursor("default");
    Swal.fire(
      "Please make sure you have selected an audio file and an output path."
    );
    return;
  }

  running = true;



  let args = {};
  
  jQuery.each(store.get("renderDefaults"), (k: string, v) => {
    let value = req[k] ?? v;
    if (value && k != "defaults-set") {
      args[k] = (value as string).replace(/\\/g,"/");
    }
  });


  ipcRenderer.sendSync("render", args)


  running = false;


  setCursor("default");

  Swal.fire({ title: "Animation Complete", icon: "success" });

  console.log("done");
}

////////////////////////
/// Defaults Manager ///
////////////////////////
function showDefaultsMenu() {
  Swal.fire({
    title: "Set Default",
    html: `
    <label for="args" >Choose an argument:</label>
    <select id="args" class='swal2-input' name="args" onchange="selectChange()">
      ${getFormOptions()}
    </select>

    <input type="text" id="argDefault" class="swal2-input" value="${store.get(
      "renderDefaults.audio"
    )}">
`,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: () => {
      let parameter =
        Swal.getPopup()!.querySelector<HTMLInputElement>("#args")!.value;
      let value =
        Swal.getPopup()!.querySelector<HTMLInputElement>("#argDefault")!.value;

      value == ""
        ? store.set(`renderDefaults.${parameter}`, null)
        : store.set(`renderDefaults.${parameter}`, value);
      assignPath(value, parameter);
    },
  });
}

function selectChange() {
  var parameter =
    Swal.getPopup()!.querySelector<HTMLInputElement>("#args")!.value;
  Swal.getPopup()!.querySelector<HTMLInputElement>("#argDefault")!.value =
    store.get(parameter, null) as string;
}

function getFormOptions() {
  let options = "";
  let defaults = store.get("renderDefaults");
  console.log(defaults);
  jQuery.each(defaults, (k: string, v) => {
    options += `<option value="${k}">${k}</option>`;
  });

  return options;
}

jQuery.each(store.get("renderDefaults"), (k, v) => {
  assignPath(ipcRenderer.sendSync("tempGet", k) ?? v, k);
});
