"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import TopBar from "../../components/topBar/TopBar";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";
import SearchBar from "../../components/searchBar/searchBar";
import BusMap from "@/components/map/BusMap";
import TrackingSection from "@/components/map/TrackingSection";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [username, setUsername] = useState<string>("Admin");
  const [activeMenu, setActiveMenu] = useState<string>("overview");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   api.get("/dashboard", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   }).then(res => setSummary(res.data));
  // }, []);

  useEffect(() => {
  const useFake = localStorage.getItem('USE_FAKE') === 'Admin';

  if (useFake) {
    // fake data for development
    setSummary({ buses: 10, drivers: 5, students: 120 });
    return;
  }

  const token = localStorage.getItem("token");
  api.get("/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => setSummary(res.data))
    .catch(err => {
      console.error("Dashboard API error", err);
      // handle error UI
    });
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login"; // redirect to login
  };

  const menuItems = [
    { label: "Tổng quan", key: "overview" },
    { label: "Theo dõi xe buýt", key: "tracking" },
    { label: "Quản lý lịch trình", key: "schedules" },
    { label: "Phân công lịch trình", key: "assign"}
  ];

  return (
    <div className="flex flex-col h-screen">
      <TopBar username={username} onLogout={handleLogout}/>
      <div className="flex flex-1">
        <LeftSidebar items={menuItems} onSelect={(key) => setActiveMenu(key)}/>
        <div className="flex-1 p-6 overflow-auto">
          <SearchBar 
            placeholder = "Search..."
            onSearch={(v)=>console.log(v)}
          />

          {activeMenu === "overview" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">Tổng quan hệ thống</h1>
              {summary ? 
              (
                <ul className="grid grid-cols-3 gap-4">
                  <li className="bg-white p-4 rounded-xl shadow">Xe buýt: {summary.buses}</li>
                  <li className="bg-white p-4 rounded-xl shadow">Tài xế: {summary.drivers}</li>
                  <li className="bg-white p-4 rounded-xl shadow">Học sinh: {summary.students}</li>
                </ul>
              ) : <p>Đang tải dữ liệu...</p>
              }
            </>
          )}

          {activeMenu === "tracking" &&(
            <>
              <TrackingSection/>
            </>
          )}
      
        </div>
      </div>
    </div>
  );
}
