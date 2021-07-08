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
        var path;
        return __generator(this, function (_b) {
            event.preventDefault();
            if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0].type) === "audio/wav" &&
                (!isLoaded() ||
                    window.confirm("Are you sure you want to overwrite current progress?"))) {
                console.log(isLoaded());
                if (isLoaded()) {
                    audio.pause();
                }
                path = event.dataTransfer.files[0].path;
                // audio = new Audio(path);
                audio.load(path);
                setTimeout(setZoomMin, 100);
                // audio.addMarker({
                //   time: 5,
                //   label: "reee",
                //   color: "000000",
                // });
            }
            return [2 /*return*/];
        });
    });
}
function setZoomMin() {
    return __awaiter(this, void 0, void 0, function () {
        var min;
        return __generator(this, function (_a) {
            while (audio.getDuration() == 0)
                ;
            min = String(innerWidth / audio.getDuration());
            console.log(min);
            console.log(innerWidth);
            console.log(audio.getDuration());
            //@ts-ignore
            document.getElementById("audioZoom").value = min;
            return [2 /*return*/];
        });
    });
}
function audioClicked(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function isLoaded() {
    return audio.getDuration() > 0;
}
//@ts-ignore
document.onkeypress = function (e) {
    if (e.key == " ") {
        if (!audio.isPlaying()) {
            audio.play();
        }
        else {
            audio.pause();
        }
    }
};
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
    console.log(zoomLevel);
};
