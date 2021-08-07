# Matamata Studio

[![Build/Release](https://github.com/Matamata-Animator/Matamata-Studio/actions/workflows/build.yml/badge.svg)](https://github.com/Matamata-Animator/Matamata-Studio/actions/workflows/build.yml) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Matamata-Animator/Matamata-Studio?label=Curerent%20Version&style=flat-square)

Easily create lip-synced animations

## Installation

### Windows

- Download and run the Windows installer from the most recent [release](https://github.com/Matamata-Animator/Matamata-Studio/releases), then choose one of the following options:

#### Automatic Install

- Launch the app, and click the `Install Requirements` button, then install each component there.

#### Manual Install

- Follow instructions [here](https://github.com/Matamata-Animator/Matamata-Core/blob/main/Windows_Install_Instructions.md) to setup your python environment.
- Install [Docker Desktop](https://www.docker.com/get-started)
- Pull the Gentle container:

```
docker pull lowerquality/gentle
```

### Ubuntu

- Download and install the `.deb` file from the most recent [release](https://github.com/Matamata-Animator/Matamata-Studio/releases), then choose one of the two options below:

#### Automatic Installation

- Launch the app, and click the `Install Requirements` button, then press `install`.

#### Manual Installation

- Install the python requirements:

```shell
curl -OL https://raw.githubusercontent.com/Matamata-Animator/Matamata-Core/main/requirements.txt
sudo pip3 install -r requirements.txt
```

- Pull the Gentle container:

```shell
sudo docker pull lowerquality/gentle
```

### Mac

Sadly, we are currently unable to support Macs. We recommend dual-booting Windows or Ubuntu, or setting up an Ubuntu virtual machine.

## Usage

### Character Configuration

- Drag your character image in the first option
  - If it loads as a small square, drag the image again, it will load this time
- Drag the blue slider change the mouth size
  - Click and drag the mouth to the correct position on your character
- Rename the **Pose Name**
- Set `Faces Folder` to the **absolute path** to the folder containing your pose images
- Press `Add Pose`
  - Now you can drag in a new pose image, change the `Pose Name`, and press `Add Pose`
- Save your character file

### Timestamps Creator

- Drag your audio into the timeline
- Press `space` to play and pause the audio
- Press `New Marker` key create and name a new pose marker
- Click on a timestamp marker to rename it
- Use the slider to zoom in or out of your timeline
- Press `Animate This` if you want to create an animation now, or press save if you want to save the timestamps file for use later

### Video Render

* Press on an option, and select the proper file
* You can set a default value for any of the options through the `Adjust Defaults` panel in the bottom right
* Once you have chose selected your options, press the `render` button
* That's it, have fun animating!
