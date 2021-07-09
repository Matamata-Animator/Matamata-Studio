"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = require("fs");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var isDev = electron_is_dev_1.default;
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
    if (!isDev) {
        win.webContents.openDevTools();
    }
});
