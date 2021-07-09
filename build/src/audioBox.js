"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wavesurfer_js_1 = __importDefault(require("wavesurfer.js"));
var wavesurfer_markers_js_1 = __importDefault(require("wavesurfer.js/dist/plugin/wavesurfer.markers.js"));
var electron_1 = require("electron");
var dialogs_1 = __importDefault(require("dialogs"));
// import { remote } from "electron";
// var Dialogs = require("dialogs");
var dialogs = dialogs_1.default({});
var audio = wavesurfer_js_1.default.create({
    container: "#waveform",
    waveColor: "blue",
    progressColor: "purple",
    height: (15 * innerHeight) / 100,
    plugins: [wavesurfer_markers_js_1.default.create([])],
    normalize: true,
});
function dropHandler(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var x, path;
        return __generator(this, function (_b) {
            event.preventDefault();
            if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0].type) === "audio/wav" &&
                (!isLoaded() ||
                    dialogs.confirm("Are you sure you want to overwrite current progress?"))) {
                console.log(isLoaded());
                if (isLoaded()) {
                    audio.pause();
                }
                else {
                    x = document.getElementById("dragHelpText");
                    if (x) {
                        x.style.display = "none";
                    }
                }
                path = event.dataTransfer.files[0].path;
                // audio = new Audio(path);
                audio.load(path);
                audio.clearMarkers();
                setTimeout(setZoomMin, 100);
            }
            return [2 /*return*/];
        });
    });
}
function setZoomMin() {
    return __awaiter(this, void 0, void 0, function () {
        var min, zoomSlider;
        return __generator(this, function (_a) {
            while (audio.getDuration() == 0)
                ;
            min = String(innerWidth / audio.getDuration());
            zoomSlider = document.getElementById("audioZoom");
            if (zoomSlider === null || zoomSlider === void 0 ? void 0 : zoomSlider.min) {
                zoomSlider.min = min;
            }
            return [2 /*return*/];
        });
    });
}
function audioClicked(event) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
function isLoaded() {
    return audio.getDuration() > 0;
}
document.onkeypress = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var overlapping, _i, _a, m, markers, e_1;
    return __generator(this, function (_b) {
        switch (e.key) {
            case " ":
                if (!audio.isPlaying()) {
                    audio.play();
                }
                else {
                    audio.pause();
                }
                break;
            case "a":
                overlapping = false;
                for (_i = 0, _a = audio.markers.markers; _i < _a.length; _i++) {
                    m = _a[_i];
                    if (m.time == audio.getCurrentTime()) {
                        overlapping = true;
                        break;
                    }
                }
                if (overlapping) {
                    break;
                }
                audio.addMarker({
                    time: audio.getCurrentTime(),
                    label: "POSE",
                    color: "000000",
                });
                markers = audio.markers.markers;
                e_1 = markers[markers.length - 1].el;
                if (e_1) {
                    e_1.children[1].children[0].onclick = function () {
                        console.log("Marker Click!");
                    };
                    e_1.children[1].children[1].onclick = function (click) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log(click);
                            dialogs.prompt("Pose Name:", "", function (r) {
                                if (r) {
                                    //@ts-ignore
                                    click.srcElement.innerText = r;
                                }
                            });
                            return [2 /*return*/];
                        });
                    }); };
                }
                break;
        }
        return [2 /*return*/];
    });
}); };
var seconds = 0;
//@ts-ignore
var inner = document.getElementById("seconds").innerHTML;
setInterval(function () {
    var _a;
    //@ts-ignore
    (_a = document.getElementById("seconds")) === null || _a === void 0 ? void 0 : _a.innerText = "Time: " + audio
        .getCurrentTime()
        .toFixed(3);
    seconds += 1;
}, 10);
//@ts-ignore
document.getElementById("audioZoom").oninput = function () {
    //@ts-ignore
    var zoomLevel = Number(this.value);
    audio.zoom(zoomLevel);
};
function saveTimestamps() {
    return __awaiter(this, void 0, void 0, function () {
        var timestamps, _i, _a, m, poseName, time, ts, ts_text, _b, timestamps_1, t;
        return __generator(this, function (_c) {
            timestamps = [];
            for (_i = 0, _a = audio.markers.markers; _i < _a.length; _i++) {
                m = _a[_i];
                poseName = m.el.innerText;
                time = Math.trunc(m.time * 1000);
                ts = { time: time, poseName: poseName };
                timestamps.push(ts);
            }
            timestamps.sort(function (a, b) {
                return a.time - b.time;
            });
            ts_text = "";
            for (_b = 0, timestamps_1 = timestamps; _b < timestamps_1.length; _b++) {
                t = timestamps_1[_b];
                ts_text += t.time + " " + t.poseName + "\n";
            }
            console.log("send");
            electron_1.ipcRenderer.invoke("saveTo", ts_text);
            return [2 /*return*/];
        });
    });
}
