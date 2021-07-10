"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = require("fs");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var electron_updater_1 = require("electron-updater");
var isDev = electron_is_dev_1.default;
if (!isDev) {
    electron_updater_1.autoUpdater.autoDownload = false;
    electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
    electron_updater_1.autoUpdater.allowDowngrade = true;
    var confirmDialog_1 = {
        buttons: ["Remind Me Later", "Download Now"],
        message: "An update is available",
    };
    electron_updater_1.autoUpdater.checkForUpdates().then(function (r) {
        if (r.updateInfo.version != electron_updater_1.autoUpdater.currentVersion.version &&
            electron_1.dialog.showMessageBoxSync(confirmDialog_1) == 1) {
            electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
        }
    });
}
try {
    require("electron-reloader")(module);
}
catch (_) { }
var path = require("path");
var win;
electron_1.ipcMain.handle("saveTo", function (ev, data, options) {
    if (options === void 0) { options = {
        title: "Save timestamps",
        default: "/",
        buttonLabel: "Save",
    }; }
    console.log("save");
    electron_1.dialog.showSaveDialog(options).then(function (r) {
        console.log(r.filePath);
        //@ts-ignore
        fs_1.writeFile(r.filePath, data, function (err) {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
    // ev.returnValue = path;
});
electron_1.app.on("ready", function () {
    win = new electron_1.BrowserWindow({
        icon: __dirname + "/icons/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    var indexHTML = path.join(__dirname + "/index.html");
    win.loadFile(indexHTML);
});
