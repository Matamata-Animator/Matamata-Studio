import { rejects } from "assert";
import { ipcMain, ipcRenderer } from "electron";
import * as os from "os";
import { exit, exitCode } from "process";

import Swal from "sweetalert2";
import { getSudo } from "../getSudo";

import Store from "electron-store";
import { UrlWithStringQuery } from "url";

import * as jQuery from "jquery";

import { applyTheme } from "../themes";
applyTheme();
const store = new Store();

interface PathReturn {
  canceled: boolean;
  filePaths: string[];
}

let req = {
  corePath: "build/render/Core/",
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
let running = false;

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
  if (!(req["audio"] || store.get("renderDefaults.audio")) || !req["output"]) {
    Swal.fire(
      "Please make sure you have selected an audio file and an output path."
    );
    return;
  }

  let pyArgs = "";
  jQuery.each(store.get("renderDefaults"), (k, v) => {
    let value = req[k] ?? v;
    if (value && k != "defaults-set") {
      pyArgs += `--${k} ${(value as string).replace(
        /\\/g,
        "/"
      )} ${getExtras()}`;
    }
  });

  running = true;

  let command = "echo 'hello world'";

  let pyCommand = `animate.py ${pyArgs}`;

  let cdCommand = "";

  let dir: string = ipcRenderer.sendSync("getCurrentDir");
  console.log(dir);
  let sudoPswd = "";
  if (os.platform() === "linux") {
    sudoPswd = await getSudo();
    pyCommand = `echo "${sudoPswd}" | sudo -S python3 ${pyCommand}`;
    dir = __dirname.replace(/ /g, "\\ ");

    if (dir.includes("app.asar")) {
      req.corePath = dir.replace("app.asar/build/render", "build/render/Core/");
      cdCommand += "cd && ";
    }
  }

  if (os.platform() === "win32") {
    pyCommand = `python ${pyCommand}`;
    if (dir.includes("app.asar")) {
      req.corePath = dir;
      req.corePath = req.corePath.replace(
        "app.asar\\build",
        "build\\render\\Core"
      );
      cdCommand += "cd && ";
    }
  }

  cdCommand += `cd ${req.corePath}`;

  command = `${cdCommand} && ${pyCommand}`;

  let a: string = await run(command);
  running = false;

  if (a == "0" || a == "99") {
    Swal.fire({ title: "Animation Complete", icon: "success" });
  } else {
    Swal.fire({
      title: "Error",
      text: a.replace(`"${sudoPswd}"`, "SUDO_PASSWORD"),
      icon: "error",
    });
  }
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
  jQuery.each(defaults, (k, v) => {
    options += `<option value="${k}">${k}</option>`;
  });
  // for (const [k, v] of store.get("renderDefaults")) {
  //   options += `<option value="${k}">${k}</option>`;
  // }
  return options;
}

jQuery.each(store.get("renderDefaults"), (k, v) => {
  assignPath(ipcRenderer.sendSync("tempGet", k) ?? v, k);
});
