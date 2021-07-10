import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";
import { ipcRenderer } from "electron";

import Dialogs from "dialogs";
import exp from "constants";

// import { remote } from "electron";
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

window.onresize = async () => {
  audio.setHeight((15 * innerHeight) / 100);
};

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
      let x: any = document.getElementById("dragHelpText-container");
      console.log(x);
      if (x) {
        x.style.display = "none";
      }

      x = document.getElementById("waveform");
      if (x) {
        x.style.display = "inherit";
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

interface Timestamp {
  time: number;
  poseName: string;
}

async function saveTimestamps() {
  let timestamps: Timestamp[] = [];
  for (const m of audio.markers.markers) {
    //@ts-ignore
    let poseName: string = m.el.innerText;
    let time: number = Math.trunc(m.time * 1000);
    let ts: Timestamp = { time: time, poseName: poseName };
    timestamps.push(ts);
  }
  timestamps.sort((a, b) => {
    return a.time - b.time;
  });

  let ts_text = "";
  for (const t of timestamps) {
    ts_text += `${t.time} ${t.poseName}\n`;
  }
  console.log("send");
  ipcRenderer.invoke("saveTo", ts_text);
}

async function createMarker() {
  let overlapping = false;
  for (const m of audio.markers.markers) {
    if (m.time == audio.getCurrentTime()) {
      overlapping = true;
      return;
    }
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
        if (r) {
          //@ts-ignore
          click.srcElement.innerText = r;
        }
      });
    };
  }
}
function togglePause() {
  if (!audio.isPlaying()) {
    audio.play();
  } else {
    audio.pause();
  }
}

document.onkeypress = async (e) => {
  switch (e.key) {
    case " ":
      togglePause();
      break;
    case "a":
      createMarker();
      break;
  }
};

export { createMarker };
