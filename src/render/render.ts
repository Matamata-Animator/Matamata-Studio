import { rejects } from "assert";
import { ipcRenderer } from "electron";
import * as os from "os";
import { exit, exitCode } from "process";

import Swal from "sweetalert2";
import { getSudo } from "../getSudo";

import Store from "electron-store";

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
document.onkeyup = async (e: KeyboardEvent) => {
  if (e.key.toLowerCase() == "r" && !running) {
    render();
  }
};

function getExtras() {
  //@ts-ignore
  let extras: HTMLInputElement = document.getElementById("extras");
  return extras.value;
}

async function run(command: string) {
  console.log(command);
  ipcRenderer.on("data", (ev, data) => {
    console.log("data", data);
  });
  ipcRenderer.on("error", (ev, err) => {
    console.log("data", err);
  });

  let ran = new Promise((resolve, reject) => {
    ipcRenderer.on("exit", (ev, exitCode) => {
      console.log(exitCode);
      resolve(exitCode);
    });

    ipcRenderer.send("run", command);
  });
  return ran;
}

async function render() {
  if (!(req["audio"] || store.get("audio")) || !req["output"]) {
    Swal.fire(
      "Please make sure you have selected an audio file and an output path."
    );
    return;
  }

  let pyArgs = "";
  for (const [k, v] of store) {
    let value = req[k] || v;
    if (value && k != "defaults-set") {
      pyArgs += `--${k} ${value} ${getExtras()}`;
    }
  }

  running = true;

  let command = "echo 'hello world'";

  let pyCommand = `animate.py ${pyArgs}`;

  let cdCommand = "";

  let dir: string = ipcRenderer.sendSync("getCurrentDir");
  if (os.platform() === "linux") {
    let sudoPswd = await getSudo();
    pyCommand = `echo "${sudoPswd}" | sudo -S python3 ${pyCommand} --codec FMP4`;
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
    }
    cdCommand += "cd && ";
  }

  cdCommand += `cd ${req.corePath}`;

  command = `${cdCommand} && ${pyCommand}`;

  await run(command);
}

////////////////////////
/// Dropdown Manager ///
////////////////////////
function showDefaultsMenu() {
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
      assignPath(value, parameter);
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
