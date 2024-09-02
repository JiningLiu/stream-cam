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
        sh("cam");
        console.log("================================");
        console.log("Camera On command executed.");
      }

      case "off": {
        sh("killall mediamtx");
        console.log("================================");
        console.log("Camera Off command executed.");
      }

      case "reboot": {
        sh("sudo reboot");
      }

      case "status": {
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

function sh(command) {
  (async () => {
    const result = exec(command);
    console.log(result);
  })();
}

console.log("================================");
console.log("Server running on port 3000");
console.log("================================");
console.log("Created by Jining Liu");
console.log("https://github.com/JiningLiu/stream-cam/");
console.log("No warranty. Open source license MIT.");
