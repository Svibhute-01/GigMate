import jwt, { SignOptions } from "jsonwebtoken";
import type { AuthPayload } from "../middleware/auth.js";

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, secret, { expiresIn });
}
