import { ipcMain, app, BrowserWindow, dialog } from "electron";

import { writeFile } from "fs";

import electronIsDev from "electron-is-dev";
import { autoUpdater } from "electron-updater";

let isDev = electronIsDev;

if (!isDev) {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = true;

  let confirmDialog = {
    buttons: ["Remind Me Later", "Download Now"],
    message: "An update is available",
  };

  autoUpdater.checkForUpdates().then((r) => {
    if (
      r.updateInfo.version != autoUpdater.currentVersion.version &&
      dialog.showMessageBoxSync(confirmDialog) == 1
    ) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
}

try {
  require("electron-reloader")(module);
} catch (_) {}

var path = require("path");

let win;
ipcMain.handle(
  "saveTo",
  (
    ev,
    data,
    options = {
      title: "Save timestamps",
      default: "/",
      buttonLabel: "Save",
    }
  ) => {
    console.log("save");

    dialog.showSaveDialog(options).then((r) => {
      console.log(r.filePath);
      //@ts-ignore
      writeFile(r.filePath, data, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
    // ev.returnValue = path;
  }
);

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
});
