"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
try {
    require("electron-reloader")(module);
}
catch (_) { }
var path = require("path");
var win;
electron_1.app.on("ready", function () {
    win = new electron_1.BrowserWindow({
        icon: __dirname + "/icons/icon.png",
    });
    var indexHTML = path.join(__dirname + "/index.html");
    win.loadFile(indexHTML);
});
