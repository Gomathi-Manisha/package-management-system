"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fab308] via-[#724e14] to-[#0f0414]">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/ups-logo.png" alt="UPS Logo" width={80} height={80} />
          <h1 className="text-[#fab308] text-3xl font-bold mt-4">Welcome Back</h1>
          <p className="text-[#946414] text-sm">Log in to manage your packages</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#fab308] font-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-[#5d3d14] text-white focus:outline-none focus:ring-2 focus:ring-[#fab308]"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#fab308] font-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 rounded-lg bg-[#5d3d14] text-white focus:outline-none focus:ring-2 focus:ring-[#fab308]"
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#fab308] text-[#0f0414] font-semibold rounded-lg hover:bg-[#a26c0c] transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-[#a26c0c] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
