import { app, BrowserWindow } from "electron";

try {
  require("electron-reloader")(module);
} catch (_) {}

var path = require("path");

let win;

app.on("ready", () => {
  win = new BrowserWindow({
    icon: __dirname + "/icons/icon.png",
  });
  const indexHTML = path.join(__dirname + "/index.html");
  win.loadFile(indexHTML);
});
