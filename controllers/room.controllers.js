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
