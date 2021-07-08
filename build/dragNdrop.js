"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dropHandler(event) {
    var _a;
    event.preventDefault();
    if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0].type) === "audio/wav") {
        var audio = new Audio(event.dataTransfer.files[0].path);
        audio.play();
        //  let audio = fs.readFileSync(event.dataTransfer.files[0].path);
        //   console.log("Audio File Selected");
    }
}
