import { ipcRenderer, app } from "electron";
import Swal from "sweetalert2";
import { existsSync, lstatSync } from "fs";
let repo = "https://github.com/Matamata-Animator/Windows-Install-Files";

let running = false;
let approved = false;
const isElevated = require("is-elevated");
(async () => {
  let e = await isElevated();
  console.log(e);
  approved = e
  if (!e) {
    Swal.fire({
      title: "You need elevated permissions to use the autoinstaller!",
      text: "Please relaunch this app as an administrator.",
      icon: "error",
      confirmButtonText: `Quit`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        ipcRenderer.send("quit");
      }
    });
  }
})();

function uninstallPython() {
  run(`curl -OL ${repo}/raw/main/py.exe && py.exe /uninstall `);
}
function installPython() {
  run(`curl -OL ${repo}/raw/main/py.exe && py.exe PrependPath=1 /passive `);
}
function installPackages() {
  run(
    `curl -OL https://raw.githubusercontent.com/Matamata-Animator/Matamata-Core/main/requirements.txt && pip install -r requirements.txt`
  );
}
let wslC = 0;
function enableWSL() {
  run(
    `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart; dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`,
    "pshell"
  );
  if (wslC == 0) {
    wslC++;
  }
}
function installKernal() {
  run(`curl -OL ${repo}/raw/main/wsl-batch-ps1/wsl2.msi && wsl2.msi `);
  if (wslC == 1) {
    wslC++;
  }
}
function setWSL2() {
  run(`wsl --set-default-version 2`, "pshell'");
  if (wslC == 2) {
    success();
  }
}
function installDocker() {
  run(
    `curl -OL https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe && "Docker%20Desktop%20Installer.exe" `
  );
}
function dockerPull() {
  run(`docker pull lowerquality/gentle:latest`);
}
function rmFFmpeg() {
  let dirPath = "C:\\ffmpeg";
  let exists = existsSync(dirPath) && lstatSync(dirPath).isDirectory();
  console.log(exists);
  if (exists) {
    run(`rmdir /S /Q C:\\ffmpeg`);
  } else {
    success();
  }
}
function downloadFFmpeg() {
  run(
    `cd C:\\ && mkdir ffmpeg\\bin && cd ffmpeg\\bin && curl -OL ${repo}/raw/main/ffmpeg/bin/ffmpeg.exe && curl -OL ${repo}/raw/main/ffmpeg/bin/ffplay.exe && curl -OL ${repo}/raw/main/ffmpeg/bin/ffprobe.exe`
  );
}
function pathFFmpeg() {
  run(`setx /M path "%path%;C:\\ffmpeg\\bin"`);
}

function success() {
  Swal.fire({
    title: "Success! Continue to the next step!",
    text: "Warning: This does not account for if you clicked 'no' on an installer.",
    icon: "success",
    width: 700,
  });
}

function run(command, type = "run") {
  if (!running && approved) {
    running = true;
    let onData = async (ev, data) => {
      console.log("data", data);
    };
    let onExit = async (ev, exitCode) => {
      running = false;
      setCursor("default");

      console.log("exit", exitCode);
      if (exitCode == 0) {
        success();
      } else if (exitCode == 1) {
        Swal.fire(
          "Permission Denied! Please run the following in terminal as an administrator:",
          command,
          "warning"
        );
      } else {
        Swal.fire(
          "Ouch!",
          'Something went wrong! (Unless this was on "Install WSL Kernal" and you\'ve already installed WSL before)',
          "error"
        );
      }
    };
    setCursor("progress");
    console.log(command);
    ipcRenderer.on("data", onData);
    ipcRenderer.on("exit", onExit);
    ipcRenderer.send(type, command);
  }
}
function setCursor(name: string) {
  document.body.style.cursor = name;
  let buttons = document.getElementsByClassName("button");
  for (const b of buttons) {
    //@ts-ignore
    b.style.cursor = name;
  }
}
