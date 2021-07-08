import WaveSurfer from "wavesurfer.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.js";

var audio = WaveSurfer.create({
  container: "#waveform",
  scrollParent: true,
  waveColor: "blue",
  progressColor: "purple",
  responsive: true,
  height: (15 * innerHeight) / 100,
  plugins: [MarkersPlugin.create([])],
  normalize: true,
});
async function dropHandler(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer?.files[0].type === "audio/wav") {
    if (isLoaded()) {
      audio.pause();
    }
    let path = event.dataTransfer.files[0].path;
    // audio = new Audio(path);
    audio.play();
    audio.load(path);

    // audio.addMarker({
    //   time: 5,
    //   label: "reee",
    //   color: "000000",
    // });
  }
}

async function audioClicked(event: MouseEvent) {
  if (isLoaded()) {
    audio.play();
    audio.currentTime = (event.clientX / innerWidth) * isLoaded().duration;
  }
}

function isLoaded() {
  return audio.duration && audio.duration > 0;
}

//@ts-ignore
document.onkeypress = (e) => {
  if (e.key == " ") {
    if (!audio.isPlaying()) {
      audio.play();
    } else {
      audio.pause();
    }
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
