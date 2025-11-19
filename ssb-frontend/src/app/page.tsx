"use client";
import { useState } from "react";
import api from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

//   const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const useFake = typeof window !== "undefined" && localStorage.getItem("USE_FAKE") === "Admin";

//   if (useFake) {
//     // Fake login — just store a fake token and redirect
//     localStorage.setItem("token", "fake-token");
//     localStorage.setItem("username", username); // optional
//     window.location.href = "/dashboard";
//     return;
//   }

//   // Real backend login (keep this if you run backend later)
//   try {
//     const res = await api.post("/auth/login", { username, password });
//     localStorage.setItem("token", res.data.token);
//     window.location.href = "/dashboard";
//   } catch {
//     alert("Sai tên đăng nhập hoặc mật khẩu");
//   }
// };


  return (
    <div 
    className="flex h-screen items-center justify-center"
    style={{ 
      backgroundColor: "var(--background)" 
      }}>
      <form 
      onSubmit={handleLogin} 
      className="bg-white p-6 rounded-2xl shadow-md w-96"
      style={{
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingBottom: "50px",
        paddingTop: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly"
      }}
      >
        <h1 
        className="text-[40px] font-bold mb-4 text-center"
        style={{
          color:"#3DA76C",
          marginBottom: "40px"
        }}
        >ĐĂNG NHẬP</h1>
        <input 
        className="border p-2 w-full mb-3 rounded-md" placeholder="Tên đăng nhập"
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
        className="border p-2 w-full mb-4 rounded-md" 
        type="password" 
        placeholder="Mật khẩu"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
        className="text-white w-full py-2 rounded-lg"
        style={{
          backgroundColor:"#43BCB2",
          fontSize: "20px",
          display: "inline-block",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "20px"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3f9f97ff")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#43BCB2")}
        >Xác nhận</button>
      </form>
    </div>
  );
}
