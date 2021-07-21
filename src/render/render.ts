import { rejects } from "assert";
import { ipcRenderer } from "electron";
import * as os from "os";
import { exit, exitCode } from "process";

import Swal from "sweetalert2";
import { getSudo } from "../getSudo";

interface matamataRequest {
  corePath: string;
  audioPath: string;
  outputPath: string;
  characterPath?: string;
  timestampsPath?: string;
  charactersPath?: string;
  phonemesPath?: string;
}
let fpath = "Core";

interface PathReturn {
  canceled: boolean;
  filePaths: string[];
}

let req: matamataRequest = {
  corePath: "build/render/Core/",
  audioPath: "",
  outputPath: "",
  characterPath: `defaults/characters.json`,
  phonemesPath: `defaults/phonemes.json`,
};

ipcRenderer.on("path", (ev, item: string, r: PathReturn) => {
  if (!r.canceled) {
    let path = r.filePaths[0];
    if (os.platform() === "linux") {
      path = path.replace(`/home/${os.userInfo().username}`, "~");
    }
    req[item] = path;
  }
});
ipcRenderer.on("savePath", (ev, item: string, r: any) => {
  if (!r.canceled) {
    let path = r.filePath;
    if (os.platform() === "linux") {
      path = path.replace(`/home/${os.userInfo().username}`, "~");
    }
    req[item] = path;
  }
});

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
    if (req.audioPath == "" || req.outputPath == "") {
      Swal.fire(
        "Please make sure you have selected an audio file and an output path."
      );
      return;
    }
    running = true;

    let command = "echo 'hello world'";

    let pyCommand = `animate.py -a ${req.audioPath} -c ${req.characterPath} -o ${req.outputPath}`;

    let cdCommand = "";

    let dir: string = ipcRenderer.sendSync("getCurrentDir");
    console.log(dir);
    if (os.platform() === "linux") {
      let sudoPswd = await getSudo();
      pyCommand = `echo "${sudoPswd}" | sudo -S python3 ${pyCommand} --codec FMP4`;
      dir = __dirname.replace(/ /g, "\\ ");

      if (dir.includes("app.asar")) {
        req.corePath = dir.replace(
          "app.asar/build/render",
          "build/render/Core/"
        );
        cdCommand += "cd && ";
      } else {
        req.corePath = "render/Core";
      }
      console.log(req.corePath);
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

    command = `${pyCommand}`;

    await run("pwd");
    await run(cdCommand);
    await run(command);
  }
};

function getExtras() {
  //@ts-ignore
  let extras: HTMLInputElement = document.getElementById("extras");
  return extras.value;
}

async function run(command: string) {
  console.log(command);
  let onData = async (ev, data) => {
    console.log("data", data.toString());
  };

  ipcRenderer.on("data", onData);

  let ran = new Promise((resolve, reject) => {
    ipcRenderer.on("exit", (exitCode) => {
      console.log(exitCode);
      resolve(exitCode);
    });

    ipcRenderer.send("run", command);
  });
  return ran;
}
