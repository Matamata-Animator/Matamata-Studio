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

let data: matamataRequest = {
  corePath: "",
  audioPath: "",
};

ipcRenderer.on("path", (ev, item: string, r: PathReturn) => {
  if (!r.canceled) {
    data[item] = r.filePaths[0];
  }
});

async function uploadPath(item, options = {}) {
  // Renderer process
  ipcRenderer.send("getPath", item, options);
}
