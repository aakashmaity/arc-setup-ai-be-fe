import mongoose from "mongoose";

export default async function connectDB(uri) {
  mongoose.set("bufferCommands", false);
  await mongoose.connect(uri);
  console.info("Connected to MongoDB.");
}
