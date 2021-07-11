import { ipcRenderer } from "electron";

interface matamataRequest {
  corePath: string;
  audioPath: string;
  characterPath?: string;
  timestampsPath?: string;
  charactersPath?: string;
}

interface PathReturn {
  canceled: boolean;
  filePaths: string[];
}

let req: matamataRequest = {
  corePath: "Matamata-Core/",
  audioPath: "",
};

ipcRenderer.on("path", (ev, item: string, r: PathReturn) => {
  if (!r.canceled) {
    req[item] = r.filePaths[0];
  }
});

async function uploadPath(item, options = {}) {
  // Renderer process
  ipcRenderer.send("getPath", item, options);
}

document.onkeypress = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() == "r") {
    let command = 'echo "Hello World"';
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
