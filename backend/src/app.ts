import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "gigmate-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(err.errors ? { errors: err.errors } : {}),
  });
});

export default app;
