"use client";
import { useState } from "react";
import api from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch {
      alert("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>
        <input className="border p-2 w-full mb-3 rounded-md" placeholder="Tên đăng nhập"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="border p-2 w-full mb-4 rounded-md" type="password" placeholder="Mật khẩu"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">Đăng nhập</button>
      </form>
    </div>
  );
}
