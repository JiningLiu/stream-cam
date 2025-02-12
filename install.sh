#!/bin/bash
# ****************************************************************
# stream-cam
# Live stream camera system based on the Raspberry Pi 5 and Camera Module 3.
#
# Initial install script
#
# Open source information to come.
# © 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.
#
# A free & (planned) open source project created by Jining Liu.
# ****************************************************************

cd ~

sudo apt update
sudo apt upgrade -y

sudo apt install lsof vim git ffmpeg adb pulseaudio gstreamer1.0-tools gstreamer1.0-rtsp gstreamer1.0-alsa alsa-utils -y

sudo apt install -f && sudo apt autoremove -y && sudo apt autoclean && sudo apt clean && sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

sudo chown -R $USER:$USER $HOME/

curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

sudo setcap cap_net_bind_service=+ep $(which bun)

git clone https://github.com/billchurch/webssh2
cd webssh2
git checkout current
cd app
bun i --production

cd ~
git clone -b dev https://github.com/JiningLiu/stream-cam.git
cd stream-cam
bun i
cd bin
chmod a+x setup
./setup