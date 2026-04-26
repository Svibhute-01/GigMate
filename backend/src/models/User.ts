import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "client";

export interface StudentProfile {
  college?: string;
  bio?: string;
  skills: string[];
  portfolioLinks: string[];
}

export interface ClientProfile {
  companyName?: string;
  description?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  studentProfile?: StudentProfile;
  clientProfile?: ClientProfile;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<StudentProfile>(
  {
    college: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String, trim: true }],
    portfolioLinks: [{ type: String, trim: true }],
  },
  { _id: false }
);

const ClientProfileSchema = new Schema<ClientProfile>(
  {
    companyName: { type: String, trim: true },
    description: { type: String, maxlength: 500 },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "client"], required: true },
    studentProfile: { type: StudentProfileSchema, default: undefined },
    clientProfile: { type: ClientProfileSchema, default: undefined },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model<IUser>("User", UserSchema);
