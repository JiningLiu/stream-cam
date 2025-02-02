#!/bin/bash
# ****************************************************************
# stream-cam
# Live stream camera system based on the Raspberry Pi 5 and Camera Module 3.
#
# Setup script
#
# Open source information to come.
# © 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.
#
# A free & (planned) open source project created by Jining Liu.
# ****************************************************************

chmod a+x ./update.sh ./audiosource

bun i

echo "alias start='cd ~/stream-cam && bun start'" >> ~/.bashrc
echo "alias dev='cd ~/stream-cam && bun dev'" >> ~/.bashrc
echo "alias stop='cd ~/stream-cam && bun stop'" >> ~/.bashrc
echo "alias update='~/stream-cam/update.sh'" >> ~/.bashrc

echo "start" >> ~/.bashrc

sudo reboot