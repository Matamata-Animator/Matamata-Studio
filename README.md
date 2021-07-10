# Matamata Desktop

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

- Timestamps
  - Load audio :heavy_check_mark:
  - Place markers :heavy_check_mark:
  - Delete markers
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
