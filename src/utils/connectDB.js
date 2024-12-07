import mongoose from "mongoose";

export default async function connectDB() {
  // do nothing if we alredy connected!
  if (mongoose.connections[0].readyState) return;

  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to database");
}
