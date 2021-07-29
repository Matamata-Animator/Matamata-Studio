import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";
import { ipcRenderer } from "electron";

import exp from "constants";

import Swal from "sweetalert2";
import * as jQuery from "jquery";

let audioPath = "";
let markerCounter = 0;

interface MarkerWithElement {
  el: HTMLElement;
  color: string;
  label: string;
  position: string;
  time: number;
}

async function confirmOverwrite(text: string) {
  let result = await Swal.fire({
    title: text,
    showDenyButton: true,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: false,
    confirmButtonText: `Yes`,
    denyButtonText: `No`,
    customClass: {
      confirmButton: "order-2",
      denyButton: "order-3",
    },
  });
  return result.isConfirmed;
}

async function getPoseName() {
  let pname = await Swal.fire({
    title: "Pose Name:",
    html: `
  <input type="poseName" id="poseName" class="swal2-input" placeholder="crossed">`,
    confirmButtonText: "Let's Go!",
    focusConfirm: false,
    allowEnterKey: true,

    preConfirm: async () => {
      let pname = (
        Swal.getPopup()?.querySelector("#poseName") as HTMLInputElement
      ).value;

      if (!pname) {
        Swal.showValidationMessage(`Please enter a pose name`);
      }
      return pname;
    },
  });
  return pname.value;
}

enum Mode {
  Select,
  Delete,
  Typing,
}
let deletedMarkerName = "DELETED-POSE-MARKER";

var audio = WaveSurfer.create({
  container: "#waveform",
  waveColor: getComputedStyle(document.body).getPropertyValue(
    "--mm-waveform-color"
  ),
  progressColor: getComputedStyle(document.body).getPropertyValue(
    "--mm-waveform-color"
  ),
  cursorColor: getComputedStyle(document.body).getPropertyValue(
    "--mm-foreground"
  ),
  // progressColor: "#50fa7b",
  height: (9 * innerWidth) / 100,
  plugins: [MarkersPlugin.create([])],
  normalize: true,
});

let mode: Mode = Mode.Select;

window.onresize = async () => {
  audio.setHeight((9 * innerWidth) / 100);
};

async function dropHandler(event: JQuery.DragEvent) {
  console.log(event);
  event.preventDefault();
  let path = event.originalEvent?.dataTransfer?.files[0].path;

  if (
    event.originalEvent?.dataTransfer?.files[0].type === "audio/wav" &&
    (!isLoaded() ||
      (await confirmOverwrite(
        "Are you sure you want to overwrite current progress?"
      )))
  ) {
    if (isLoaded()) {
      audio.pause();
    } else {
      let x: any = document.getElementById("dragHelpText-container");
      if (x) {
        x.style.display = "none";
      }

      x = document.getElementById("waveform");
      if (x) {
        x.style.display = "inherit";
      }
    }

    // audio = new Audio(path);
    console.log(path);
    if (path) {
      audioPath = path;
      audio.load(path);
      audio.clearMarkers();
      audio.on("ready", function () {
        setZoomMin();
      });
    }
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

function isLoaded() {
  return audio.getDuration() > 0;
}

setInterval(function () {
  document.getElementById("seconds")!.innerText = `Time: ${audio
    .getCurrentTime()
    .toFixed(3)}`;
}, 10);

document.getElementById("audioZoom")!.oninput = function () {
  let zoomLevel = Number((this as HTMLInputElement).value);
  audio.zoom(zoomLevel);
};

interface Timestamp {
  time: number;
  poseName: string;
}
async function exportTimestamps() {
  let timestamps: Timestamp[] = [];
  let restrictedNames = [deletedMarkerName, " ", ""];
  for (const m of audio.markers.markers) {
    let poseName: string = (m as MarkerWithElement).el.innerText;
    let time: number = Math.trunc(m.time * 1000);
    if (restrictedNames.indexOf(poseName) == -1) {
      let ts: Timestamp = { time: time, poseName: poseName };
      timestamps.push(ts);
    }
  }
  timestamps.sort((a, b) => {
    return a.time - b.time;
  });

  let ts_text = "";
  for (const t of timestamps) {
    ts_text += `${t.time} ${t.poseName}\n`;
  }
  return ts_text;
}

async function saveTimestamps() {
  let ts_text = await exportTimestamps();
  let path = ipcRenderer.sendSync("getSavePath").filePath;
  ipcRenderer.send("saveTo", path, ts_text);
}

async function animateThis() {
  let ts_text = await exportTimestamps();
  let path = ipcRenderer.sendSync("userDataPath");
  path = `${path}/timestamps.txt`;
  ipcRenderer.send("saveTo", path, ts_text);
  ipcRenderer.send("tempSet", "timestamps", path);
  ipcRenderer.send("tempSet", "audio", audioPath);

  document.location.href = "../render/render.html";
}

async function createMarker(name = "POSE") {
  mode = Mode.Select;
  for (const m of audio.markers.markers) {
    if (m.time == audio.getCurrentTime()) {
      return;
    }
  }

  audio.addMarker({
    time: audio.getCurrentTime(),
    label: name,
    color: getComputedStyle(document.body).getPropertyValue("--mm-background"),
  });

  var markers = audio.markers.markers;

  let e = (markers[markers.length - 1] as MarkerWithElement).el;

  if (e) {
    e.id = `marker-${markerCounter}`;
    markerCounter++;
    (e.children[1] as HTMLElement).onclick = function (click: MouseEvent) {
      if (mode === Mode.Delete) {
        deleteMarker(click);
      } else if (mode === Mode.Select) {
        mode = Mode.Typing;

        getPoseName().then((r) => {
          if (r) {
            (e.children[1].children[1] as HTMLElement).innerText = r;
            mode = Mode.Select;
          }
        });
      }
    };
  }
}

function togglePause() {
  if (mode == Mode.Typing) return;
  if (!audio.isPlaying()) {
    audio.play();
  } else {
    audio.pause();
  }
}

function deleteMarker(click: MouseEvent) {
  let path = click.composedPath() as HTMLElement[];
  let marker = path.filter((a) =>
    a.className?.includes("wavesurfer-marker")
  )[0];

  (audio.markers.markers as MarkerWithElement[]).forEach((m) => {
    if (m.el.id == marker.id)
      m.el.children[1]!.children[1].innerHTML = deletedMarkerName;
  });

  marker.remove();
}

document.onkeypress = async (e) => {
  console.log(e);
  switch (e.key.toLowerCase()) {
    case " ":
      togglePause();
      break;
    case "s":
      mode = Mode.Select;
      break;
    case "a":
      createMarker();
      break;
    case "d":
      mode = Mode.Delete;
      break;
    case "enter":
      let x = document.getElementsByClassName("swal2-confirm")[0];
      if (x) {
        eventFire(x, "click");
      }
      break;
  }
};

function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
