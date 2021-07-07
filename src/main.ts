import { app, BrowserWindow } from "electron";
var path = require("path");

let win;

app.on("ready", () => {
  win = new BrowserWindow();
  const indexHTML = path.join(__dirname + "/index.html");
  win.loadFile(indexHTML);
});
