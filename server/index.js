// Created by Jining Liu
// https://github.com/JiningLiu/stream-cam/
// No warranty. Open source license MIT.

const { exec } = require("child_process");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });
let clients = [];

let camSettings = {
  ev: "0.0",
  gain: "0.0",
  wb: "auto",
  mf: "default",
};

wss.on("connection", function connection(ws) {
  clients.push(ws);
  clients.forEach((client) => {
    client.send("New client connected. IP: " + ws._socket.remoteAddress);
  });

  ws.on("message", (buffer) => {
    const msgArray = buffer.toString().split(" ");
    const command = msgArray[0];
    const input = msgArray[1];

    switch (command) {
      case "on": {
        console.log("================================");
        console.log(
          "Executing camera on command. IP: " + ws._socket.remoteAddress
        );
        sh("~/stream-cam/mediamtx &", ws);
        break;
      }

      case "off": {
        console.log("================================");
        console.log(
          "Executing camera off command. IP: " + ws._socket.remoteAddress
        );
        sh("killall mediamtx", ws);
        break;
      }

      case "set-ev": {
        camSettings.ev = input;
        break;
      }

      case "set-gain": {
        camSettings.gain = input;
        break;
      }

      case "set-wb": {
        camSettings.wb = input;
        break;
      }

      case "set-mf": {
        camSettings.mf = input;
        break;
      }

      case "reboot": {
        sh("sudo reboot");
        break;
      }

      case "status": {
        status(ws);
        break;
      }
    }
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    clients.forEach((client) => {
      client.send("Client disconnected. IP: " + ws._socket.remoteAddress);
    });
  });
});

function saveConfig() {

  const command = "rpicam-vid -t 0 --camera 0 --nopreview --codec yuv420 --vflip --hflip --width 1920 --height 1080 --framerate 30 --ev " + camSettings.ev + " --gain " + camSettings.gain + " --awb " + camSettings.wb + " --lens-position " + camSettings.mf + " --autofocus-speed fast --inline --listen -o - | ffmpeg -f rawvideo -pix_fmt yuv420p -s:v 1920x1080 -i /dev/stdin -c:v libx264 -preset ultrafast -tune zerolatency -c:a libmp3lame -b:a 64k -f rtsp rtsp://localhost:$RTSP_PORT/$MTX_PATH"
  console.log("New command: " + command)
  // default command:
  // rpicam-vid -t 0 --camera 0 --nopreview --codec yuv420 --vflip --hflip --width 1920 --height 1080 --framerate 30 --inline --listen -o - | ffmpeg -f rawvideo -pix_fmt yuv420p -s:v 1920x1080 -i /dev/stdin -c:v libx264 -preset ultrafast -tune zerolatency -c:a libmp3lame -b:a 64k -f rtsp rtsp://localhost:$RTSP_PORT/$MTX_PATH
}

function sh(command, ws) {
  exec(command);
  status(ws);
}

function status(ws) {
  console.log("================================");
  exec("pgrep mediamtx", (error, stdout, stderr) => {
    console.log(
      "Status requested: " +
        (error ? "off" : "on") +
        ". IP: " +
        ws._socket.remoteAddress
    );
    if (error) {
      ws.send("off");
    } else {
      ws.send("on");
    }
  });
}

console.log("================================");
console.log("Server running on port 3000");
console.log("================================");
console.log("Created by Jining Liu");
console.log("https://github.com/JiningLiu/stream-cam/");
console.log("No warranty. Open source license MIT.");
