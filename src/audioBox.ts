import * as fs from "fs";
import { play } from "sound-play";

let audio: HTMLAudioElement;

async function dropHandler(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer?.files[0].type === "audio/wav") {
    audio = new Audio(event.dataTransfer.files[0].path);
    audio.play();
    //  let audio = fs.readFileSync(event.dataTransfer.files[0].path);
    //   console.log("Audio File Selected");
  }
}

async function audioClicked(event: MouseEvent) {
  if (audio) {
    audio.play();
    audio.currentTime = (event.clientX / innerWidth) * audio.duration;
  }
}
