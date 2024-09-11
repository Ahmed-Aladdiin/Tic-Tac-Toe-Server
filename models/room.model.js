// occupancy, isJoinable, turn, players, playerIndex, maxRounds, currentRound
import mongoose from "mongoose";
import playerSchema from "./player.model.js";

const roomSchema = new mongoose.Schema({
  occupancy: {
    type: Number,
    default: 2
  },
  isJoinable: {
    type: Boolean,
    default: true
  },
  maxRounds: {
    type: Number,
    default: 5
  },
  currentRound: {
    type: Number,
    default: 1
  }, 
  players: [playerSchema],
  turn: playerSchema,
  playerIndex: {
    type: Number,
    default: 0
  }
});

const Room = mongoose.model('room', roomSchema);

export default Room;