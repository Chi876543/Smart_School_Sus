"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { validateLogin } from "@/utils/validateLogin";
import Toast from "@/components/toast/toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Toast
  const [showToast, setShowToast] = useState(false);
  const [showToast1, setShowToast1] = useState(false);
  // Validation errors
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Hiển thị thông báo đăng xuất thành công nếu có
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("logoutSuccess") === "true") {
        setShowToast1(true);
        localStorage.removeItem("logoutSuccess");

        setTimeout(() => setShowToast1(false), 3000);
      }
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
        {/* Username */}
        <input 
        className="border p-2 w-full mb-3 rounded-md" placeholder="Tên đăng nhập"
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username}</p>
        )}
        {/* Password */}
        <div className="relative">
          <input 
            className="border p-2 w-full mb-4 rounded-md" 
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onMouseDown={() => setShowPassword(true)}     
            onMouseUp={() => setShowPassword(false)}      
            onMouseLeave={() => setShowPassword(false)} 
          >
            {/* icon đẹp */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}
        {/* Submit */}
        <button 
        className="text-white w-full py-2 rounded-lg cursor-pointer"
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
