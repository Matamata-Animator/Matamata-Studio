"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
electron_1.contextBridge.exposeInMainWorld("electron", {
    startDrag: function (fileName) {
        electron_1.ipcRenderer.send("ondragstart", path_1.default.join(process.cwd(), fileName));
    },
});
