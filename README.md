# Matamata Desktop

[![Build/Release](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml/badge.svg)](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Matamata-Animator/Desktop?label=Curerent%20Version&style=flat-square) 

A GUI interface to easily use [Matamata](https://github.com/Matamata-Animator/Matamata)

## Installation

### Windows

Download and run the Windows installer from the most recent [release](https://github.com/Matamata-Animator/Desktop/releases).

### Ubuntu

Download the `.deb` file from the most recent [release](https://github.com/Matamata-Animator/Desktop/releases).

### Mac

Sadly, we are currently unable to support Macs. We recommend dual-booting in order to use this tool. 

## Timeline to v1.0:

:heavy_check_mark: - Feature is completed

- Timestamps
  - Load audio :heavy_check_mark:
  - Place markers :heavy_check_mark:
  - Delete markers :heavy_check_mark:
  - Rename markers :heavy_check_mark:
  - Export timestamps :heavy_check_mark:
  - Tool buttons
  - Instructions
- Character Creator (Eventually will be rewritten) :heavy_check_mark:
  - Port cc to electron :heavy_check_mark:
  - Start menu to choose a tool :heavy_check_mark:
- Core
  - Interface between GUI and core
  - Choose export location
  - Basic export settings
- General
  - Allow the program to "flow" from one section to the next, so the user can make an animation without exiting the program
  - Autobuild :heavy_check_mark:
  - Automatic updates:heavy_check_mark:

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
- Indicate the name of the folder *in relation to the **Matamata Core** folder*
- You don’t need to fill the **Default Mouth** 
- If everything is alright in the first pose click Add Pose
  - Now you can drag a new image following the first part in this tutorial, and keep clicking `Add Pose` until you prepare all the pictures that you want to use
- Save your new file
