const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server started on port 3000");
});

// Begin websocket
const WebsocketServer = require("ws").Server;

const wss = new WebsocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log(`Total clients: ${numClients}`);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readState === ws.OPEN) {
    ws.send("Welcome to the server");
  }

  ws.on("close", function close() {
    ws.broadcast(`Current visitors: ${numClients}`);
    console.log("A client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
