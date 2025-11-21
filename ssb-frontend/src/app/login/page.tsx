"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { validateLogin } from "@/utils/validateLogin";
import Toast from "@/components/toast/toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showToast1, setShowToast1] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Hiển thị thông báo đăng xuất thành công nếu có
  useEffect(() => {
    const logoutSuccess = localStorage.getItem("logoutSuccess");
    if (logoutSuccess === "true") {
      setShowToast1(true);
      localStorage.removeItem("logoutSuccess");
      const timer = setTimeout(() => setShowToast1(false), 3000);
      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, []);
  
  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang

    const result = validateLogin(username, password); // Validate dữ liệu
    setErrors(result);
    if (result.username || result.password) return;

    try {
      const res = await api.post("/auth/login", { username, password }); // Gọi API đăng nhập
      document.cookie = `token=${res.data.token}; path=/;`; // Lưu token vào cookie
      localStorage.setItem("username", res.data.username); // Lưu username vào localStorage
      localStorage.setItem("loginSuccess", "true");
      window.location.href = "/dashboard"; // Chuyển hướng sang dashboard
    } catch {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };


  // Giao diện trang đăng nhập
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
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username}</p>
        )}
        <input 
        className="border p-2 w-full mb-4 rounded-md" 
        type="password" 
        placeholder="Mật khẩu"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}
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
      {/* Toast */}
      {showToast1 && <Toast message="Đăng xuất thành công" type="success" />}
      {showToast && <Toast message="Đăng nhập thất bại!" type="error" />}
    </div>
  );
}
