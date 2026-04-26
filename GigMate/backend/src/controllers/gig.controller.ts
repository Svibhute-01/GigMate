import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Gig } from "../models/Gig.js";

const gigSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(60),
  price: z.number().nonnegative(),
  deliveryDays: z.number().int().min(1).max(365),
  skills: z.array(z.string()).default([]),
});

const gigUpdateSchema = gigSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export async function listGigs(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, category, minPrice, maxPrice, student } = req.query as Record<string, string>;
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (student) filter.student = student;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };

    const gigs = await Gig.find(filter)
      .populate("student", "name role studentProfile")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ gigs });
  } catch (err) {
    next(err);
  }
}

export async function getGig(req: Request, res: Response, next: NextFunction) {
  try {
    const gig = await Gig.findById(req.params.id).populate("student", "name role studentProfile");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json({ gig });
  } catch (err) {
    next(err);
  }
}

export async function getMyGigs(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const gigs = await Gig.find({ student: req.user.userId }).sort({ createdAt: -1 });
    res.json({ gigs });
  } catch (err) {
    next(err);
  }
}

export async function createGig(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const data = gigSchema.parse(req.body);
    const gig = await Gig.create({ ...data, student: req.user.userId });
    res.status(201).json({ gig });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
}

export async function updateGig(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not your gig" });
    }
    const data = gigUpdateSchema.parse(req.body);
    Object.assign(gig, data);
    await gig.save();
    res.json({ gig });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
}

export async function deleteGig(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not your gig" });
    }
    await gig.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
