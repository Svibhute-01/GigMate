import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Order } from "../models/Order.js";
import { Gig } from "../models/Gig.js";

const createOrderSchema = z.object({
  gigId: z.string().min(1),
  requirements: z.string().max(1000).optional(),
});

const statusSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
});

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { gigId, requirements } = createOrderSchema.parse(req.body);
    const gig = await Gig.findById(gigId);
    if (!gig || !gig.isActive) return res.status(404).json({ message: "Gig not available" });

    const order = await Order.create({
      gig: gig._id,
      client: req.user.userId,
      student: gig.student,
      price: gig.price,
      requirements,
      status: "pending",
    });
    res.status(201).json({ order });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
}

export async function listMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const filter =
      req.user.role === "client"
        ? { client: req.user.userId }
        : { student: req.user.userId };
    const orders = await Order.find(filter)
      .populate("gig", "title category price deliveryDays")
      .populate("client", "name email")
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { status } = statusSchema.parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isStudent = order.student.toString() === req.user.userId;
    const isClient = order.client.toString() === req.user.userId;
    if (!isStudent && !isClient) return res.status(403).json({ message: "Forbidden" });

    // Permission rules
    if (status === "in-progress" || status === "completed") {
      if (!isStudent) return res.status(403).json({ message: "Only the freelancer can set this status" });
    }
    if (status === "cancelled") {
      if (!isClient) return res.status(403).json({ message: "Only the client can cancel" });
    }

    order.status = status;
    await order.save();
    res.json({ order });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
}
