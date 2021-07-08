import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";

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
      window.confirm("Are you sure you want to overwrite current progress?"))
  ) {
    console.log(isLoaded());
    if (isLoaded()) {
      audio.pause();
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
  console.log(min);
  console.log(innerWidth);
  console.log(audio.getDuration());
  //@ts-ignore
  document.getElementById("audioZoom").min = min;
}

async function audioClicked(event: MouseEvent) {
  // if (isLoaded()) {
  //   audio.currentTime = (event.clientX / innerWidth) * audio.getDuration();
  // }
}

function isLoaded() {
  return audio.getDuration() > 0;
}

//@ts-ignore
document.onkeypress = (e) => {
  switch (e.key) {
    case " ":
      if (!audio.isPlaying()) {
        audio.play();
      } else {
        audio.pause();
      }
      break;
    case "a":
      audio.addMarker({
        time: audio.getCurrentTime(),
        label: "reee",
        color: "000000",
      });
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
  console.log(zoomLevel);
};
