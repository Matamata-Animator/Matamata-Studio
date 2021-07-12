import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";
import { ipcRenderer } from "electron";

import exp from "constants";

import Swal from "sweetalert2";

async function confirmOverwrite(text: string) {
  console.log("reeee");
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
      //@ts-ignore
      let pname = Swal.getPopup().querySelector("#poseName").value;

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
  waveColor: "blue",
  progressColor: "purple",
  height: (9 * innerWidth) / 100,
  plugins: [MarkersPlugin.create([])],
  normalize: true,
});

let mode: Mode = Mode.Select;

window.onresize = async () => {
  audio.setHeight((9 * innerWidth) / 100);
};

async function dropHandler(event: DragEvent) {
  event.preventDefault();
  let path = event.dataTransfer?.files[0].path;

  if (
    event.dataTransfer?.files[0].type === "audio/wav" &&
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
    if (path) {
      audio.load(path);
      audio.clearMarkers();
      audio.on("ready", function () {
        setZoomMin();
      });
    }
    console.log("drag");
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
  let restrictedNames = [deletedMarkerName, " ", ""];
  for (const m of audio.markers.markers) {
    //@ts-ignore
    let poseName: string = m.el.innerText;
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
    e.children[1].onclick = (click: MouseEvent) => {
      if (mode === Mode.Delete) {
        console.log(mode);
        deleteMarker(click);
      }
    };
    e.children[1].ondblclick = async (click: MouseEvent) => {
      if (mode === Mode.Select) {
        mode = Mode.Typing;
        console.log(click);

        getPoseName().then((r) => {
          if (r) {
            //@ts-ignore
            click.path[0].innerText = r;
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
  console.log(click);
  //@ts-ignore
  let marker = click.path[2];
  marker.style.display = "none";
  marker.style.innerText = deletedMarkerName;
  //TODO: actually remove the marker from audio.markers.markers
  mode = Mode.Select;
}

document.onkeypress = async (e) => {
  switch (e.key.toLowerCase()) {
    case " ":
      togglePause();
      break;
    case "s":
      mode = Mode.Select;
      break;
    case "a":
      mode = Mode.Select;
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
