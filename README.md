# RPi Streaming Camera

## DIY Instructions

### Hardware

You will need:

- Raspberry Pi 5 2GB
- 32GB microSD Card
- Pi 5 Active Cooler
- Pi 5 Power Supply
- Raspberry Pi Camera Module 3
- Pi 5 Camera Ribbon Cable
- Router (only need one for all cameras)

...and the following:

- 4pcs M2 10mm
- 4pcs M2 nut
- 4pcs M2.5 10mm
- 4pcs M2.5 nut
- 4pcs M4 10mm
- 1pc 1/4-20 UNC nut
- 2pcs small zip/cable ties

Download the 3MF file located in the [hardware](./hardware) directory 3D print the parts.

Put together the setup according to the [assembly instructions](./hardware/ASSEMBLY.md).

### Software

Use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash SD card with [Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/) (64-bit) with desktop ([version used for this release](https://downloads.raspberrypi.com/raspios_arm64/images/raspios_arm64-2024-07-04/2024-07-04-raspios-bookworm-arm64.img.xz))
- Setup SSH in Raspberry Pi Imager settings.

Note that the commands below will take a bit of time to run.

#### Follow these steps to finish setup.

```bash
sudo raspi-config
```
- Turn on VNC
- Set boot/login options to desktop (auto login)

```bash
sudo apt update
sudo apt upgrade
sudo apt install vim

curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

nvm install --lts

echo "alias serve='node ~/stream-cam/server/index.js &'" >> ~/.bashrc
echo "alias cam='~/stream-cam/mediamtx &'" >> ~/.bashrc
echo "alias stop='killall node & killall mediamtx'" >> ~/.bashrc
source ~/.bashrc

git clone https://github.com/JiningLiu/stream-cam/

cd stream-cam/server
npm i

echo "serve" >> ~/.bashrc

sudo reboot
```

Your Pi will now reboot, and automatically start the server when it's on.

Now, connect to your Pi using VNC. From the GUI, add the Wi-Fi network that you would like to use for video transmission.

Your Pi is now ready for live streaming!