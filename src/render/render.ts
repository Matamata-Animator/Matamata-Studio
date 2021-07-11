import { ipcRenderer, remote } from "electron";
import * as os from "os";
interface matamataRequest {
  corePath: string;
  audioPath: string;
  characterPath?: string;
  timestampsPath?: string;
  charactersPath?: string;
  phonemesPath?: string;
}
let fpath = "Matamata-Core";

interface PathReturn {
  canceled: boolean;
  filePaths: string[];
}

let req: matamataRequest = {
  corePath: "Matamata-Core/",
  audioPath: "",
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

async function uploadPath(item, options = {}) {
  // Renderer process
  ipcRenderer.send("getPath", item, options);
}

document.onkeypress = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() == "r") {
    // let command = `sudo python3 ${fpath}/animate.py -a ${req.audioPath} --generate_folder ${fpath}/generate --vosk_model ${fpath}/model/ --config ${fpath}/config.txt -c ${req.characterPath} -m ${req.phonemesPath}`;
    let command = `cd Matamata-Core && sudo python3 animate.py -a ${req.audioPath} -c ${req.characterPath} -m ${req.phonemesPath}`;
    console.log(__dirname);
    console.log(command);
    let onData = (data) => {
      console.log("data", data);
    };
    let onExit = (exitCode) => {
      console.log("exit", exitCode);
    };
    ipcRenderer.send("run", command);
    ipcRenderer.on("data", onData);
    ipcRenderer.on("exit", onExit);
  }
};
