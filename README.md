<h1 align="center">
▶️ stream-cam
</h1>

<p align="center">
<b>
🎥 Live stream camera with PoE and M.2 SSD based on the Raspberry Pi 5 and Camera Module 3 🔴
</b>
</p>

> ### 🚧 This project is in early development. Please check back for more information.

> ⚠️ For the **original** stream-cam project, visit [JiningLiu/stream-cam-legacy](https://github.com/JiningLiu/stream-cam-legacy)

## Development

```bash
# install depenncies
bun i

# run in development environment
bun dev

# run in production environment
bun start
```

## Installation

> ❗ This script installs the latest version in the **development** branch. Please only use for testing purposes.

Before installation, make sure you have a **fresh, clean** installation of Raspberry Pi OS 64-bit Lite from **November 19th, 2024**. ([Download](https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2024-11-19/2024-11-19-raspios-bookworm-arm64-lite.img.xz))

We recommend you use a separate microSD card if your RPi is also being used for another purpose. Doing a fresh installation ensures compatibility and ease of debugging.

Prior to running the installation script, please run:

```bash
sudo raspi-config
```

...and setup console auto-login and your locale.

Last but not least, simply run the command below to fetch and run the installation script.

```bash
curl https://raw.githubusercontent.com/JiningLiu/stream-cam/refs/heads/dev/install.sh | bash
```

Your RPi will restart at the end of the first installation step. The process will automatically finish upon reboot and the servers will be started automatically. The installation process make take several minutes or more depending on your internet speed.

## Scripts

The following `bun` scripts simplifies the start/stop process for the servers.

### Production

```bash
bun start # start inactive/idle server(s)
bun start:force # kill existing instances & start servers
bun start:backend # start backend server (asks if existing should be killed)
bun start:ui # start UI server (asks if existing should be killed)
bun start:extensions # start extensions server (asks if existing should be killed)
```

### Development (RPi)

```bash
bun dev
bun dev:force
bun dev:backend
bun dev:ui
bun dev:extensions
```

### Development (macOS)

```bash
bun dev-mac
bun dev-mac:force
bun dev-mac:backend
bun dev-mac:ui
bun dev-mac:extensions
```

### Stopping (RPi)

```bash
bun stop # kill both servers
bun stop:backend # kills backend server
bun stop:ui # kills UI server
bun stop:extensions # kills extensions server
```

### Stopping (macOS)

```bash
bun stop-mac
bun stop-mac:backend
bun stop-mac:ui
bun stop-mac:extensions
```

## Licenses

### Credits

[bluenviron/mediamtx](https://github.com/bluenviron/mediamtx) ([MIT License](https://github.com/bluenviron/mediamtx/blob/main/LICENSE))

[gdzx/audiosource](https://github.com/gdzx/audiosource) ([MIT License](https://github.com/gdzx/audiosource/blob/master/LICENSE))

[eemeli/yaml](https://github.com/eemeli/yaml) ([ISC License](https://github.com/eemeli/yaml/blob/main/LICENSE))

[uuidjs/uuid](https://github.com/uuidjs/uuid) ([MIT License](https://github.com/uuidjs/uuid/blob/main/LICENSE.md))

[billchurch/webssh2](https://github.com/billchurch/webssh2) ([MIT License](https://github.com/billchurch/webssh2/blob/main/LICENSE))

### stream-cam

Open source information to come. Planned release under the MIT License.

© 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.