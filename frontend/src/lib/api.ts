import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gigmate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "client";
  studentProfile?: {
    college?: string;
    bio?: string;
    skills?: string[];
    portfolioLinks?: string[];
  };
  clientProfile?: {
    companyName?: string;
    description?: string;
  };
  createdAt?: string;
};

export type Gig = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  skills: string[];
  isActive: boolean;
  student: User | string;
  createdAt: string;
};

export type Order = {
  _id: string;
  gig: { _id: string; title: string; category: string; price: number; deliveryDays: number };
  client: { _id: string; name: string; email: string };
  student: { _id: string; name: string; email: string };
  price: number;
  requirements?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
};
