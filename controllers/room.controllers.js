import Room from "../models/room.model.js";
export const createRoom = async (io, client, { nickname }) => {
  const room = new Room();
  const player = {
    nickname,
    socketID: client.id,
    character: "X",
  };

  room.players.push(player);
  room.turn = player;
  //
  console.log("got a request to create a room");
  console.log(`${client.id}`);

  try {
    const roomDoc = await room.save();
    const roomID = roomDoc._id.toString();
    client.leaveAll();
    client.join(roomID);
    io.to(roomID).emit("create-room-success", roomDoc);
  } catch (error) {
    console.error(error);
  }
};

export const joinRoom = async (io, client, { nickname, roomID }) => {
  if (!roomID.match(/^[0-9a-fA-F]{24}$/)) {
    client.emit("join-error", "Please enter a valid room ID");
    return;
  }

  const room = await Room.findById(roomID);
  if (!room) {
    client.emit("join-error", "Room was not found");
    return;
  }

  if (room.isJoinable) {
    const player = {
      nickname,
      socketID: client.id,
      character: "O",
    };

    room.players.push(player);
    room.isJoinable = false;
    const roomDoc = await room.save();

    //
    console.log("player tries joining to a room");
    console.log(player);

    client.join(roomID);
    io.to(roomID).emit("join-room-success", roomDoc);
    roomPreChars.set(roomID, "O");

    //
    console.log(`players of the room\n${getSocketIdsInRoom(roomID, io)}`);
  } else {
    client.emit("join-error", "Room is full, try creating a new room");
    return;
  }
};
// auxiliary functions
const getSocketIdsInRoom = (roomID, io) => {
  const room = io.sockets.adapter.rooms.get(roomID);
  if (room) {
    // Convert the set of socket IDs to an array
    const socketIds = Array.from(room);
    return socketIds;
  } else {
    return ["room was not found"];
  }
};
