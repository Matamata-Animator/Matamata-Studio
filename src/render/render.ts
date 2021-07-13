import { ipcRenderer } from "electron";
import * as os from "os";

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
    let pyCommand = `animate.py -a ${req.audioPath} -c ${req.characterPath} -m ${req.phonemesPath} -o ${req.outputPath}`;
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
      }
      console.log(req.corePath);
    }

    let onData = async (ev, data) => {
      console.log("data", data);
    };
    let onExit = async (ev, exitCode) => {
      console.log("exit", exitCode);
    };

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
    console.log(command);

    ipcRenderer.on("data", onData);
    ipcRenderer.on("exit", onExit);

    ipcRenderer.send("run", "pwd");

    ipcRenderer.send("run", command);
  }
};
