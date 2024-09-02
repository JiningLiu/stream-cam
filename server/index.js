// Created by Jining Liu
// https://github.com/JiningLiu/stream-cam/
// No warranty. Open source license MIT.

const { exec } = require("child_process");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });
const clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);
  clients.forEach((client) => {
    client.send("New client connected. IP: " + ws._socket.remoteAddress);
  });

  ws.on("message", (buffer) => {
    const message = buffer.toString();

    switch (message) {
      case "on": {
        sh("~/stream-cam/mediamtx &", ws);
        console.log("================================");
        console.log("Camera On command executed.");
        break;
      }

      case "off": {
        sh("killall mediamtx", ws);
        console.log("================================");
        console.log("Camera Off command executed.");
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

function sh(command, ws) {
  (async () => {
    const result = exec(command);
    console.log("Command exit code: " + result.exitCode);
    status(ws);
  })();
}

function status(ws) {
  console.log("================================");
  console.log("Status requested. IP: " + ws._socket.remoteAddress);
  (async () => {
    const result = await exec("pgrep mediamtx");
    if (result.exitCode === 0) {
      ws.send("on");
    } else {
      ws.send("off");
    }
  })();
}

console.log("================================");
console.log("Server running on port 3000");
console.log("================================");
console.log("Created by Jining Liu");
console.log("https://github.com/JiningLiu/stream-cam/");
console.log("No warranty. Open source license MIT.");
