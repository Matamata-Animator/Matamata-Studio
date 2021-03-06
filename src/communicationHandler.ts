import { exec } from "child_process";
import { ipcMain, dialog, app } from "electron";

import Store from "electron-store";
import { writeFileSync } from "fs";

import { autoUpdater } from "electron-updater";

Store.initRenderer();

let tempStore = {};

export function setupHandlers() {
  ipcMain.on("getSemVer", (ev) => {
    ev.returnValue = autoUpdater.currentVersion;
  });
  ipcMain.on("getCurrentDir", (ev) => {
    ev.returnValue = __dirname;
  });
  ipcMain.on("getOpenPath", (ev, item, options) => {
    let r = dialog.showOpenDialog(options).then((r) => {
      console.log(r);
      ev.reply("path", item, r);
    });
  });
  ipcMain.on("getSavePath", (ev, item = "", options = {}) => {
    let r = dialog.showSaveDialog(options).then((r) => {
      console.log(r);
      ev.reply("savePath", item, r);
      ev.returnValue = r;
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
  ipcMain.on("saveTo", (ev, path, data) => {
    console.log("save");
    writeFileSync(path, data);
  });
  ipcMain.on("tempSet", (ev, key, value) => {
    tempStore[key] = value;
  });
  ipcMain.on("tempGet", (ev, key) => {
    ev.returnValue = tempStore[key];
  });
  ipcMain.on("userDataPath", (ev) => {
    ev.returnValue = app.getPath("userData");
  });
}
