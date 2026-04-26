import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`[GigMate API] listening on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error("[GigMate API] failed to start:", err);
    process.exit(1);
  }
}

start();
