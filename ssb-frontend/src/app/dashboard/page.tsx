"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import TopBar from "../../components/topBar/TopBar";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";
import TrackingSection from "@/components/map/TrackingSection";
import ScheduleManagement from "@/components/ScheduleManagement";
import Assignment from "../../components/assignment/DriverAssignment";
import LogoutConfirmModal from "./pageConfirm";
import Toast from "@/components/toast/toast";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [activeMenu, setActiveMenu] = useState<string>("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Lấy token từ cookie
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    
    // Nếu không có token, chuyển hướng về trang đăng nhập  
    if (!token) {
      window.location.href = "/login";
      return;
    }
    // Hiển thị thông báo đăng nhập thành công nếu có
    if (localStorage.getItem("loginSuccess") === "true") {
      setShowToast(true);
      localStorage.removeItem("loginSuccess");
      setTimeout(() => setShowToast(false), 3000);
    }
    // Lấy username từ localStorage  
    const username = typeof window !== "undefined"
    ? localStorage.getItem("username")
    : null;
    setUsername(username || "");
    if (username) {
      setSummary({ buses: 10, drivers: 5, students: 120 });
      return;
    }

    // Gọi API lấy dữ liệu tổng quan
    api
      .get("/dashboard")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Dashboard API error", err));
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.setItem("logoutSuccess", "true");
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Tổng quan", key: "overview" },
    { label: "Theo dõi xe buýt", key: "tracking" },
    { label: "Quản lý lịch trình", key: "schedules" },
    { label: "Phân công lịch trình", key: "assign" },
  ];

  // Giao diện trang dashboard
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar username={username} onLogout={() => setShowLogoutConfirm(true)} />
      <div className="flex flex-1">
        <LeftSidebar items={menuItems} onSelect={(key) => setActiveMenu(key)} />
        <div className="flex-1 p-6 overflow-auto">
          {activeMenu === "overview" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">
                Tổng quan hệ thống
              </h1>
              {summary ? (
                <ul className="grid grid-cols-3 gap-4">
                  <li className="bg-white p-4 rounded-xl shadow">
                    Xe buýt: {summary.buses}
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow">
                    Tài xế: {summary.drivers}
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow">
                    Học sinh: {summary.students}
                  </li>
                </ul>
              ) : (
                <p>Đang tải dữ liệu...</p>
              )}
            </>
          )}

          {activeMenu === "tracking" && (
            <>
              <TrackingSection />
            </>
          )}

          {activeMenu === "schedules" && <ScheduleManagement />}
          {activeMenu === "assign" && <Assignment />}
        </div>
      </div>

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
      {/* Hiện thị toast login success */}
      {showToast && <Toast message="Đăng nhập thành công!" type="success" />}
    </div>
    
  );
}
