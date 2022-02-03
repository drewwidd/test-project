const express = require("express");
const app = express();
const PORT = 8080;
const server = require("http").createServer(app);
const io = require("socket.io")(server,{cors:{origin:"*"}})
server.listen(PORT,() => {
  console.log("Server listening at port: "+PORT)
});

const positions = {};
io.on("connection", function (socket) {
  //each time someone visits the site and connect to socket.io this function  gets called
  //it includes the socket object from which you can get the id, useful for identifying each client
  console.log(`${socket.id} connected`);

  //lets add a starting position when the client connects
  positions[socket.id] = { x: 0.5, y: 0.5 };

  socket.on("disconnect", () => {
    //when this client disconnects, lets delete its position from the object.
    delete positions[socket.id];
    console.log(`${socket.id} disconnected`);
  });

  //client can send a message 'updatePosition' each time the clients position changes
  socket.on("updatePosition", (data) => {
    positions[socket.id].x = data.x;
    positions[socket.id].y = data.y;
  });
});

//send positions every framerate to each client
const frameRate = 30;
setInterval(() => {
  io.emit("positions", positions);
}, 1000 / frameRate);