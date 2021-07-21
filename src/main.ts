import { ipcMain, app, BrowserWindow, dialog, shell } from "electron";

import { writeFile } from "fs";

import electronIsDev from "electron-is-dev";
let isDev = electronIsDev;

import { autoUpdater } from "electron-updater";
import * as os from "os";

import * as fetch from "node-fetch";
import { exec } from "child_process";

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

// try {
//   require("electron-reloader")(module);
// } catch (_) {}

var path = require("path");
let win: BrowserWindow;
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
  }
);

ipcMain.on("getCurrentDir", (ev) => {
  ev.returnValue = __dirname;
});
ipcMain.on("getOpenPath", (ev, item, options) => {
  let r = dialog.showOpenDialog(options).then((r) => {
    console.log(r);
    ev.reply("path", item, r);
  });
});
ipcMain.on("getSavePath", (ev, item, options) => {
  let r = dialog.showSaveDialog(options).then((r) => {
    console.log(r);
    ev.reply("savePath", item, r);
  });
});

ipcMain.on("run", (ev, command) => {
  let onData = (d: string) => {
    console.log(d);
    ev.reply(d);
  };
  let onExit = (e) => {
    console.log("exit", String(e));
    ev.reply("exit", String(e));
  };
  let onError = (e, code) => {
    console.log(`Error ${code}: ${e}`);
    ev.reply("error", `Error ${code}: ${e}`);
  };

  exec(command, (error, stdout, stderr) => {
    if (error) {
      onError(error.message, 2);
      return;
    }
    if (stderr) {
      // onError(stderr, 1);
      // return;
    }
    onData(`stdout: ${stdout}`);
    onExit(99);
  });
});

ipcMain.on("pshell", (ev, command) => {
  let onData = (d) => {
    console.log("data", String(d));
    ev.reply("data", String(d));
  };
  let onExit = (e) => {
    console.log("exit", String(e));
    ev.reply("exit", String(e));
  };
  const Shell = require("node-powershell");
  const ps = new Shell({
    executionPolicy: "Bypass",
    noProfile: true,
  });
  ps.addCommand(command);
  ps.invoke()
    .then((output) => {
      onData(output);
      ev.reply("exit", 0);
    })
    .catch((err) => {
      onData(err);
      onExit(1);
      console.log(err);
    });
});
ipcMain.on("quit", () => {
  app.quit();
});
app.on("ready", () => {
  win = new BrowserWindow({
    icon: __dirname + "/icons/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    minWidth: 775,
  });

  win.maximize();
  let indexHTML = path.join(__dirname + "/menu/index.html");

  // indexHTML = path.join(__dirname + "/render/render.html");

  win.loadFile(indexHTML);
});
