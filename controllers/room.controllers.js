import Room from "../models/room.model.js";
import { checkWinning } from "./game.controllers.js";

const roomPreChars = new Map();

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

export const tapTile = async (io, { index, char, gameBoard, roomID }) => {
  // check for multiple taps
  const preChar = roomPreChars.get(roomID);
  if (char === preChar) return;
  roomPreChars.set(roomID, char);

  const room = await Room.findById(roomID);
  gameBoard[index] = char;
  const win = checkWinning(gameBoard);
  io.to(roomID.toString()).emit("edit-tile", { char: char, index: index });
  const firstPlayer = room.players[0];
  const secondPlayer = room.players[1];

  if (win) {
    if (room.currentRound == room.maxRounds) {
      char == "X" ? firstPlayer.points++ : secondPlayer.points++;
      const winner =
        firstPlayer.points > secondPlayer.points ? firstPlayer : secondPlayer;
      io.to(roomID.toString()).emit("game-end", winner);
      roomPreChars.delete(roomID);
    } else {
      room.currentRound++;
      const winner = char == "X" ? firstPlayer : secondPlayer;
      winner.points++;
      const roomDoc = await room.save();
      io.to(roomID.toString()).emit("round-win", {
        roomDoc: roomDoc,
        winner: winner,
      });
    }
  } else if (!gameBoard.includes("")) {
    io.to(roomID).emit("tie");
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
