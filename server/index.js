// Created by Jining Liu
// https://github.com/JiningLiu/stream-cam/
// No warranty. Open source license MIT.

const { exec } = require("child_process");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });
let clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);
  clients.forEach((client) => {
    client.send("New client connected. IP: " + ws._socket.remoteAddress);
  });

  ws.on("message", (buffer) => {
    const message = buffer.toString();

    switch (message) {
      case "on": {
        console.log("================================");
        console.log("Executing camera on command. IP: " + ws._socket.remoteAddress);
        sh("~/stream-cam/mediamtx &", ws);
        break;
      }

      case "off": {
        console.log("================================");
        console.log("Executing camera off command. IP: " + ws._socket.remoteAddress);
        sh("killall mediamtx", ws);
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
  exec(command);
  status(ws)
}

function status(ws) {
  console.log("================================");
  exec("pgrep mediamtx", (error, stdout, stderr) => {
    console.log("Status requested: " + (error ? "off" : "on") + ". IP: " + ws._socket.remoteAddress);
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
