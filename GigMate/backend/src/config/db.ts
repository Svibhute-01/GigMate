import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  let url = process.env.MONGO_URL;

  if (!url || url.includes("localhost") || url.includes("127.0.0.1")) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mem = await MongoMemoryServer.create({
      instance: { dbName: "gigmate" },
    });
    url = mem.getUri();
    console.log("[MongoDB] using in-memory instance");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(url);
  console.log("[MongoDB] connected");
}
