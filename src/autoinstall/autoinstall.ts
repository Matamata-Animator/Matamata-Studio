import Swal from "sweetalert2";
import { ipcRenderer } from "electron";

import { getSudo } from "../getSudo";

import * as os from "os";

let command = "";

if (os.platform() === "linux") {
  command = `
    sudo apt install ffmpeg python3-pip python3-opencv docker.io && curl -OL https://raw.githubusercontent.com/Matamata-Animator/Matamata-Core/main/requirements.txt && sudo pip3 install -r requirements.txt && sudo docker pull lowerquality/gentle
`;
  let commandText = document.getElementById("commandText");
  if (commandText) {
    commandText.innerText = `Press install or run the following:
${command}

`;
  }
}

async function install() {
  if (os.platform() == "linux") {
    let sudoPswd = await getSudo();
    let onData = async (ev, data) => {
      console.log("data", data);
    };
    let onExit = async (ev, exitCode) => {
      console.log("exit", exitCode);
    };

    ipcRenderer.on("data", onData);
    ipcRenderer.on("exit", onExit);
    ipcRenderer.send(
      "run",
      command.replace("sudo", `echo "${sudoPswd}" | sudo -S`)
    );
  }
}
