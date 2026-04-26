import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const url = process.env.MONGO_URL;
  if (!url) {
    throw new Error("MONGO_URL is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(url);
  console.log("[MongoDB] connected");
}
