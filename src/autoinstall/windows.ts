import { ipcRenderer } from "electron";
import Swal from "sweetalert2";
import { existsSync, lstatSync } from "fs";
let repo = "https://github.com/Matamata-Animator/Windows-Install-Files";

ipcRenderer.send("pshell", "echo node-powershell");

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
  let onData = async (ev, data) => {
    console.log("data", data);
  };
  let onExit = async (ev, exitCode) => {
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

  console.log(command);
  ipcRenderer.on("data", onData);
  ipcRenderer.on("exit", onExit);
  ipcRenderer.send(type, command);
}
