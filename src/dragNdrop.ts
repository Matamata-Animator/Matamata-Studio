import * as fs from "fs";
import { play } from "sound-play";

function dropHandler(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer?.files[0].type === "audio/wav") {
    const audio = new Audio(event.dataTransfer.files[0].path);
    audio.play();
    //  let audio = fs.readFileSync(event.dataTransfer.files[0].path);
    //   console.log("Audio File Selected");
  }
}
