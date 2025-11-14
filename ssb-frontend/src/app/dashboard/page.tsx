"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSideBar";
import ScheduleManagement from "@/components/ScheduleManagement";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [username, setUsername] = useState<string>("Admin");

  // ←←← THÊM CHỈ 1 DÒNG NÀY: Đọc trang hiện tại từ URL
  const [currentPage, setCurrentPage] = useState("overview");

  useEffect(() => {
    const page = new URLSearchParams(location.search).get("page");
    if (page === "schedules") setCurrentPage("schedules");
    else setCurrentPage("overview");
  }, []);

  // ←←← Khi bấm menu → thay đổi URL (không reload trang)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes("Quản lý lịch trình")) {
        e.preventDefault();
        setCurrentPage("schedules");
        window.history.replaceState(null, "", "?page=schedules");
      }
      if (target.textContent?.includes("Tổng quan")) {
        e.preventDefault();
        setCurrentPage("overview");
        window.history.replaceState(null, "", "/dashboard");
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const useFake = localStorage.getItem('USE_FAKE') === 'Admin';
    if (useFake) {
      setSummary({ buses: 10, drivers: 5, students: 120 });
      return;
    }
    const token = localStorage.getItem("token");
    api.get("/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSummary(res.data))
      .catch(err => console.error("Dashboard API error", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Tổng quan", key: "overview" },
    { label: "Theo dõi xe buýt", key: "tracking" },
    { label: "Quản lý lịch trình", key: "schedules" },
    { label: "Phân công lịch trình", key: "assign" }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar username={username} onLogout={handleLogout} />
      <div className="flex flex-1">
        {/* Giữ nguyên 100% – không thêm prop nào */}
        <LeftSidebar items={menuItems} />

        <div className="flex-1 p-6 overflow-auto">
          {/* Tổng quan */}
          {currentPage === "overview" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">Tổng quan hệ thống</h1>
              {summary ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-4xl font-bold text-blue-600">{summary.buses}</p>
                    <p className="text-gray-600 mt-2">Xe buýt</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-4xl font-bold text-green-600">{summary.drivers}</p>
                    <p className="text-gray-600 mt-2">Tài xế</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-4xl font-bold text-purple-600">{summary.students}</p>
                    <p className="text-gray-600 mt-2">Học sinh</p>
                  </div>
                </div>
              ) : <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
            </>
          )}

          {/* QUẢN LÝ LỊCH TRÌNH – BẤM VÀO MENU LÀ HIỆN */}
          {currentPage === "schedules" && <ScheduleManagement />}
        </div>
      </div>
    </div>
  );
}