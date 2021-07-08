import { ipcMain, app, BrowserWindow, dialog } from "electron";

try {
  require("electron-reloader")(module);
} catch (_) {}

var path = require("path");

let win;

app.on("ready", () => {
  win = new BrowserWindow({
    icon: __dirname + "/icons/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const indexHTML = path.join(__dirname + "/index.html");
  win.loadFile(indexHTML);
  win.webContents.openDevTools();
});
