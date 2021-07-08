import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";
import { ipcRenderer } from "electron";

import Dialogs from "dialogs";
// var Dialogs = require("dialogs");

var dialogs = Dialogs({});

var audio = WaveSurfer.create({
  container: "#waveform",
  waveColor: "blue",
  progressColor: "purple",
  height: (15 * innerHeight) / 100,
  plugins: [MarkersPlugin.create([])],
  normalize: true,
});
async function dropHandler(event: DragEvent) {
  event.preventDefault();

  if (
    event.dataTransfer?.files[0].type === "audio/wav" &&
    (!isLoaded() ||
      dialogs.confirm("Are you sure you want to overwrite current progress?"))
  ) {
    console.log(isLoaded());
    if (isLoaded()) {
      audio.pause();
    } else {
      let x = document.getElementById("dragHelpText");
      if (x) {
        x.style.display = "none";
      }
    }
    let path = event.dataTransfer.files[0].path;
    // audio = new Audio(path);
    audio.load(path);
    audio.clearMarkers();
    setTimeout(setZoomMin, 100);
  }
}

async function setZoomMin() {
  while (audio.getDuration() == 0);
  let min = String(innerWidth / audio.getDuration());

  let zoomSlider: any = document.getElementById("audioZoom");
  if (zoomSlider?.min) {
    zoomSlider.min = min;
  }
}

async function audioClicked(event: MouseEvent) {}

function isLoaded() {
  return audio.getDuration() > 0;
}

document.onkeypress = async (e) => {
  switch (e.key) {
    case " ":
      if (!audio.isPlaying()) {
        audio.play();
      } else {
        audio.pause();
      }
      break;
    case "a":
      let overlapping = false;
      for (const m of audio.markers.markers) {
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

      var markers = audio.markers.markers;

      //@ts-ignore
      let e = markers[markers.length - 1].el;

      if (e) {
        e.children[1].children[0].onclick = () => {
          console.log(`Marker Click!`);
        };
        e.children[1].children[1].onclick = async (click: MouseEvent) => {
          console.log(click);

          dialogs.prompt("Pose Name:", "", (r) => {
            //@ts-ignore
            click.srcElement.innerText = r;
          });
        };
      }
      break;
  }
};

var seconds = 0;
//@ts-ignore
var inner = document.getElementById("seconds").innerHTML;
setInterval(function () {
  //@ts-ignore
  document.getElementById("seconds")?.innerText = `Time: ${audio
    .getCurrentTime()
    .toFixed(3)}`;
  seconds += 1;
}, 10);

//@ts-ignore
document.getElementById("audioZoom").oninput = function () {
  //@ts-ignore
  let zoomLevel = Number(this.value);
  audio.zoom(zoomLevel);
};
