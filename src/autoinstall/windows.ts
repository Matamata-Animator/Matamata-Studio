import { ipcRenderer } from "electron";
import Swal from "sweetalert2";

let repo = "https://github.com/Matamata-Animator/Windows-Install-Files";

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
function enableWSL() {
  run(
    `curl -OL${repo}/raw/main/wsl-batch-ps1/wsl1.ps1 && Powershell.exe -Command "& {Start-Process Powershell.exe -ArgumentList '-ExecutionPolicy Bypass -File %~dp0wsl1.ps1' -Verb RunAs}"`
  );
}
function installKernal() {
  run(`curl -OL ${repo}/raw/main/wsl-batch-ps1/wsl2.msi && wsl2.msi `);
}
function setWSL2() {
  run(
    `curl -OL${repo}/raw/main/wsl-batch-ps1/wsl2.ps1 && Powershell.exe -Command "& {Start-Process Powershell.exe -ArgumentList '-ExecutionPolicy Bypass -File %~dp0wsl2.ps1' -Verb RunAs}"`
  );
}
function installDocker() {
  run(
    `curl -OL https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe && "Docker%20Desktop%20Installer.exe" `
  );
}
function dockerPull() {
  run(`docker pull lowerquality/gentle:latest`);
}
function run(command) {
  let onData = async (ev, data) => {
    console.log("data", data);
  };
  let onExit = async (ev, exitCode) => {
    console.log("exit", exitCode);
    if (exitCode == 0) {
      Swal.fire({
        title: "Success! Continue to the next step!",
        text: "Warning: This does not account for if you clicked 'no' on an installer.",
        icon: "success",
        width: 700,
      });
    } else {
      Swal.fire(
        "Ouch!",
        'Something went wrong!(unless this was on "Install WSL Kernal" and you\'ve already installed WSL before)',
        "error"
      );
    }
  };

  console.log(command);
  ipcRenderer.on("data", onData);
  ipcRenderer.on("exit", onExit);
  ipcRenderer.send("run", command);
}
