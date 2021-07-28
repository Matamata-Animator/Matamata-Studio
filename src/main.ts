import { ipcMain, app, BrowserWindow, dialog } from "electron";

import { setupHandlers } from "./communicationHandler";
import electronIsDev from "electron-is-dev";
let isDev = electronIsDev;

import { autoUpdater } from "electron-updater";
import * as os from "os";

import * as fetch from "node-fetch";
import { checkDefaults } from "./renderDefaults";
function checkStatus(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw Error(res.statusText);
  }
}

if (!isDev) {
  let confirmDialog: Electron.MessageBoxSyncOptions = {
    buttons: ["Remind Me Later", "Download Now"],
    message: "An update is available",
    defaultId: 1,
    title: "Update Dialog",
  };
  if (os.platform() != "linux") {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowDowngrade = true;

    autoUpdater.checkForUpdates().then((r) => {
      console.log(r.updateInfo.version);
      if (
        r.updateInfo.version != autoUpdater.currentVersion.version &&
        dialog.showMessageBoxSync(confirmDialog) == 1
      ) {
        autoUpdater.downloadUpdate();
      }
    });
  } else {
    fetch
      .default(
        `https://api.github.com/repos/Matamata-Animator/Desktop/releases`
      )
      .then(checkStatus)
      .then((res) => {
        if (
          res[0].tag_name.replace("v", "") !=
            autoUpdater.currentVersion.version &&
          dialog.showMessageBoxSync(confirmDialog) == 1
        ) {
          let asset = res[0].assets.filter((a) => a.name.includes(".deb"));
          if (asset[0]) {
            console.log(asset[0].browser_download_url);
            require("open")(asset[0].browser_download_url);
          }
        }
      });
  }
}

try {
  require("electron-reloader")(module);
} catch (_) {}

var path = require("path");
let win: BrowserWindow;

app.on("ready", () => {
  win = new BrowserWindow({
    icon: __dirname + "/icons/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 1045,
    minWidth: 775,
    minHeight: 650,
  });
  win.maximize();
  let indexHTML = path.join(__dirname + "/menu/index.html");

  // indexHTML = path.join(__dirname + "/render/render.html");

  win.loadFile(indexHTML);

  setupHandlers();
  checkDefaults();
  ipcMain.on("quit", () => {
    app.quit();
  });
});
