import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "client";

export interface StudentProfile {
  college?: string;
  degree?: string;
  year?: string;
  bio?: string;
  skills: string[];
  portfolioLinks: string[];
  projects: string[];
}

export interface ClientProfile {
  companyName?: string;
  description?: string;
  industry?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isProfileComplete: boolean;
  studentProfile?: StudentProfile;
  clientProfile?: ClientProfile;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<StudentProfile>(
  {
    college: { type: String, trim: true },
    degree: { type: String, trim: true },
    year: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String, trim: true }],
    portfolioLinks: [{ type: String, trim: true }],
    projects: [{ type: String, trim: true }],
  },
  { _id: false }
);

const ClientProfileSchema = new Schema<ClientProfile>(
  {
    companyName: { type: String, trim: true },
    description: { type: String, maxlength: 500 },
    industry: { type: String, trim: true },
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
    isProfileComplete: { type: Boolean, default: false },
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
