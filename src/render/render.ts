const { ipcRenderer } = require("electron");

interface matamataRequest {
  corePath: string;
  audioPath: string;
  characterPath?: string;
  timestampsPath?: string;
}

let data: matamataRequest = {
  corePath: "",
  audioPath: "",
};

async function uploadPath(
  item,
  options = {
    title: "Chosse a path",
    default: "/",
    buttonLabel: "upload",
  }
) {
  // Renderer process
  ipcRenderer.send("getPath", item, options);
}
// // Main process
// ipcMain.handle("some-name", async (event, someArgument) => {
//   const result = await doSomeWork(someArgument);
//   return result;
// });
