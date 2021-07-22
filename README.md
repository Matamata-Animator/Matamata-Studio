# Matamata Desktop

[![Build/Release](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml/badge.svg)](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Matamata-Animator/Desktop?label=Curerent%20Version&style=flat-square)

A GUI interface to easily use [Matamata](https://github.com/Matamata-Animator/Matamata)

## Installation

### Windows

- Download and run the Windows installer from the most recent [release](https://github.com/Matamata-Animator/Desktop/releases), then choose one of the following options:

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

- Download and install the `.deb` file from the most recent [release](https://github.com/Matamata-Animator/Desktop/releases), then choose one of the two options below:

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

## Timeline to v1.0:

:heavy_check_mark: - Feature is completed

- Timestamps :heavy_check_mark:
  - Load audio :heavy_check_mark:
  - Place markers :heavy_check_mark:
  - Delete markers :heavy_check_mark:
  - Rename markers :heavy_check_mark:
  - Export timestamps :heavy_check_mark:
  - Tool buttons :heavy_check_mark:
  - Instructions :heavy_check_mark:
- Character Creator (Eventually will be rewritten) :heavy_check_mark:
  - Port cc to electron :heavy_check_mark:
  - Start menu to choose a tool :heavy_check_mark:
- Core :heavy_check_mark:
  - Interface between GUI and core :heavy_check_mark:
  - Choose export location :heavy_check_mark:
  - Basic export settings :heavy_check_mark:
  - Text box for additional options :heavy_check_mark:
- Render :heavy_check_mark:
  - Alerts on error/success :heavy_check_mark:
- General :heavy_check_mark:
  - Allow the program to "flow" from one section to the next, so the user can make an animation without exiting the program :heavy_check_mark:
  - Autobuild :heavy_check_mark:
  - Automatic updates :heavy_check_mark:
  - Automatic dependency install :heavy_check_mark:
    - Ubuntu :heavy_check_mark:
    - Windows :heavy_check_mark:

## Tutorial

### Timestamps Creator

- Drag your audio to the timeline
- `space` play and pause the audio
- `a` key create a timestamp called POSE
- Double click in a timestamp to rename it
- Use the green slider to zoom in or out in your timeline
- When you click the button **save** you can name it extension as `.txt` in case you want to easily open and edit any information

### Character Configurator

- Drag your character image in the first option
  - If it loads as a small square, drag the image again, it will load this time
- You don’t need to load a custom mouth
- The blue slider change the mouth size
  - Click and drag it to the correct position
- Rename the **Pose Name**
  - Confirm if is facing left (or not)
- Indicate the name of the folder _in relation to the **Matamata Core** folder_
- You don’t need to fill the **Default Mouth**
- If everything is alright in the first pose click Add Pose
  - Now you can drag a new image following the first part in this tutorial, and keep clicking `Add Pose` until you prepare all the pictures that you want to use
- Save your new file
