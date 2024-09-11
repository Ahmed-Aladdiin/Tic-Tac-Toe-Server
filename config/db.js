import mongoose from "mongoose";

const DB = process.env.DB_STRING; // database connection string

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log(`Connected to mongoDB successful`);
  } catch (error) {
    console.error(`Couldn't connect to server`);
    console.error(error);
  }
}

export default connectDB;
