"use strict";
document.getElementById("drag").ondragstart = function (event) {
    event.preventDefault();
    window.electron.startDrag("drag-and-drop.md");
};
