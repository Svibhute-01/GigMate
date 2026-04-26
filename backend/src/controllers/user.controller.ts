import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { User } from "../models/User.js";

const studentProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  college: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  portfolioLinks: z.array(z.string()).optional(),
});

const clientProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  companyName: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
});

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "student") {
      const data = studentProfileSchema.parse(req.body);
      if (data.name !== undefined) user.name = data.name;
      const sp = user.studentProfile ?? { skills: [], portfolioLinks: [] };
      if (data.college !== undefined) sp.college = data.college;
      if (data.bio !== undefined) sp.bio = data.bio;
      if (data.skills !== undefined) sp.skills = data.skills;
      if (data.portfolioLinks !== undefined) sp.portfolioLinks = data.portfolioLinks;
      user.studentProfile = sp;
    } else {
      const data = clientProfileSchema.parse(req.body);
      if (data.name !== undefined) user.name = data.name;
      const cp = user.clientProfile ?? {};
      if (data.companyName !== undefined) cp.companyName = data.companyName;
      if (data.description !== undefined) cp.description = data.description;
      user.clientProfile = cp;
    }

    await user.save();
    res.json({ user });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
}
