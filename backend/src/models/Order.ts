import mongoose, { Document, Schema, Types } from "mongoose";

export type OrderStatus = "pending" | "in-progress" | "completed" | "cancelled";

export interface IOrder extends Document {
  gig: Types.ObjectId;
  client: Types.ObjectId;
  student: Types.ObjectId;
  price: number;
  requirements?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    gig: { type: Schema.Types.ObjectId, ref: "Gig", required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    requirements: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
