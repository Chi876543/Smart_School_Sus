"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSummary(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tổng quan hệ thống</h1>
      {summary ? (
        <ul className="grid grid-cols-3 gap-4">
          <li className="bg-white p-4 rounded-xl shadow">Xe buýt: {summary.buses}</li>
          <li className="bg-white p-4 rounded-xl shadow">Tài xế: {summary.drivers}</li>
          <li className="bg-white p-4 rounded-xl shadow">Học sinh: {summary.students}</li>
        </ul>
      ) : <p>Đang tải dữ liệu...</p>}
    </div>
  );
}
