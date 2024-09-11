import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    trim: true,
    required: true,
  },
  socketID: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
});

export default playerSchema;