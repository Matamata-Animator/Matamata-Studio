# Matamata Desktop

[![Build/Release](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml/badge.svg)](https://github.com/Matamata-Animator/Desktop/actions/workflows/build.yml) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Matamata-Animator/Desktop?label=Curerent%20Version&style=flat-square) [![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/matamata)

A GUI interface to easily use [Matamata](https://github.com/Matamata-Animator/Matamata)

## Installation

### Windows

Download and run the Windows installer from the most recent [release](https://github.com/Matamata-Animator/Desktop/releases).

### Ubuntu

Install snap if you do not already have it

```shell
sudo apt update
sudo apt install snapd
```

Install Matamata

```shell
snap install matamata
```

### Mac

Install [homebrew](https://brew.sh/#install)

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install snap

```shell
brew install snap
```

Install Matamata

```shell
snap install matamata
```

## Timeline to v1.0:

:heavy_check_mark: - Feature is completed

- Timestamps :heavy_check_mark:
  - Load audio :heavy_check_mark:
  - Place markers :heavy_check_mark:
  - Delete markers :heavy_check_mark:
  - Rename markers :heavy_check_mark:
  - Export timestamps :heavy_check_mark:
- Character Creator
  - Port cc to electron
  - Fix double drag bug
- Core
  - Interface between GUI and core
  - Choose export location
  - Basic export settings
- General
  - Allow the program to "flow" from one section to the next, so the user can make an animation without exiting the program
  - Autobuild :heavy_check_mark:
  - Automatic updates:heavy_check_mark:
