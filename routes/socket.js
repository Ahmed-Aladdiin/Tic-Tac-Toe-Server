import { createRoom, joinRoom, tapTile } from "../controllers/room.controllers.js";

const socketServerHandler = (io) => {
  // listen to different clients
  io.on("connection", (client) => {
    client.on("create-room", (data) => createRoom(io, client, data));
    client.on("join-room", (data) => joinRoom(io, client, data));
    client.on("tap-tile", (data) => tapTile(io, data));
  });
};

export default socketServerHandler;