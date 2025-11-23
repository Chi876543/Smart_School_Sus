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
import StudentTable from "@/components/overviewTable/studentOverview";
import DriverTable from "@/components/overviewTable/driverOverview";
import BusTable from "@/components/overviewTable/busOverview";
import RouteTable from "@/components/overviewTable/routeOverview";

const menuItems = [
    { 
      label: "Tổng quan", 
      key: "overview" ,
      children: [
        { label: "Học sinh", key: "overview-students" },
        { label: "Tài xế", key: "overview-drivers" },
        { label: "Xe buýt", key: "overview-buses" },
        { label: "Tuyến đường", key: "overview-routes" },
      ],
    },
    { 
      label: "Theo dõi xe buýt",
      key: "tracking" 
    },
    { 
      label: "Quản lý lịch trình", 
      key: "schedules" 
    },
    { 
      label: "Phân công lịch trình", 
      key: "assign" 
    },
  ];

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [activeMenu, setActiveMenu] = useState<string>(menuItems[0].children?.[0]?.key || menuItems[0].key);
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

  // Giao diện trang dashboard
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-hidden">
      <TopBar username={username} onLogout={() => setShowLogoutConfirm(true)} />
      <div className="flex flex-1">
        <LeftSidebar items={menuItems} onSelect={(key) => setActiveMenu(key)} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">

            <div style={{ display: activeMenu === "overview-students" ? "block" : "none" }}>
              <StudentTable />
            </div>
            <div style={{ display: activeMenu === "overview-drivers" ? "block" : "none" }}>
              <DriverTable />
            </div>
            <div style={{ display: activeMenu === "overview-buses" ? "block" : "none" }}>
              <BusTable />
            </div>
            <div style={{ display: activeMenu === "overview-routes" ? "block" : "none" }}>
              <RouteTable />
            </div>

            {/* Giao diện theo dõi xe */}
            {activeMenu === "tracking" && (
              <div className="h-full overflow-hidden">
                <TrackingSection />
              </div>
            )}

            {/* Giao diện quản lý lịch trình */}
            {activeMenu === "schedules" && <ScheduleManagement/>}

            {/* Giao diện phân công */}
            {activeMenu === "assign" && <Assignment/>}
          </div>
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
