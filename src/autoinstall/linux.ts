import Swal from "sweetalert2";
import { ipcRenderer } from "electron";

import { getSudo } from "../getSudo";

import * as os from "os";

let command = "";

if (os.platform() === "linux") {
  command = `
  sudo systemctl start docker && curl -OL https://raw.githubusercontent.com/Matamata-Animator/Matamata-Core/main/requirements.txt && sudo pip3 install -r requirements.txt && sudo docker pull lowerquality/gentle
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

    // command = command.replace(/sudog/, `echo "${sudoPswd}" | sudo -S`);
    command = command.split("sudo").join(`echo "${sudoPswd}" | sudo -S`);
    console.log(command);
    ipcRenderer.on("data", onData);
    ipcRenderer.on("exit", onExit);
    ipcRenderer.send("run", command);
  }
}
