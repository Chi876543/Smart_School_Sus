// src/components/ScheduleManagement.tsx
"use client";

import { useEffect, useState } from "react";
import AddScheduleModal from "./AddScheduleModal/AddScheduleModal";
import DetailScheduleModal from "./DetailScheduleModal";
import api from "@/services/api";

interface Schedule {
  id: string;
  name: string;
  routeName: string;
  dateStart: string;
  dateEnd: string;
  status: string;
}

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]); // toàn bộ lịch trình
  const [routes, setRoutes] = useState<any[]>([]); // toàn bộ tuyến đường

  const [filtered, setFiltered] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // fetch data schedule từ backend
  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const res = await api.get("/schedules");  // axios thay fetch
      const list = Array.isArray(res.data) ? res.data : [];

      setSchedules(list.filter((s:any) => s.status !== "cancelled"));
      setFiltered(list.filter((s:any) => s.status !== "cancelled"));
      
    } catch (err) {
      console.error(err);
      alert("Không kết nối được backend hoặc lỗi dữ liệu!");
      setSchedules([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch chi tiết lịch trình
  const fetchScheduleDetail = async (id: string) => {
    try {
      const res = await api.get(`/schedules/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      alert("Không tải được dữ liệu chi tiết!");
      return null;
    }
  };

  // fetch danh sách tuyến đường
  const fetchRoutes = async () => {
    const res = await api.get("/schedules/routes");
    setRoutes(res.data);
  };

  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(schedules);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = schedules.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.routeName.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [searchTerm, schedules]);

  // Chọn hàng để thực hiện chức năng
  const handleRowClick = (id: string) => {
    setSelectedSchedule(schedules.find(s => s.id === id) || null);
  };

  // Xem chi tiết
  const openDetail = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  }

  // Chỉnh sửa lịch trình
  const handleEdit = async () => {
    if (!selectedSchedule) {
      alert("Vui lòng chọn 1 lịch trình để sửa!");
      return;
    }
    

    const detail = await fetchScheduleDetail(selectedSchedule.id);
    if (!detail) return;
    console.log("DETAIL STUDENTS:", detail.students);

    const match = routes.find(r => r.name === detail.routeName);
    detail.routeId = match ? match._id : "";

    setEditData(detail);        // lưu dữ liệu chi tiết để truyền vào form
    setIsEditModalOpen(true);   // mở form sửa
  };

  // Xóa lịch trình
  const handleDelete = async (id: string) => {
    if (!id) return alert("Không tìm thấy ID lịch trình");

    const confirmDelete = window.confirm("Bạn có chắc muốn xoá lịch trình này?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/schedules/${id}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Xoá thất bại!");
      }

      alert("Xoá thành công!");
      fetchSchedules(); // reload danh sách
    } catch (err: any) {
      alert("Lỗi khi xoá: " + err.message);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl text-green-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Thanh tìm kiếm + nút hành động */}
      <div className="bg-white shadow-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 shadow-md transition"
          >
            Thêm
          </button>
          <button 
            onClick={handleEdit}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 shadow-md transition">
            Sửa
          </button>
          <button 
            onClick={() => {
              if (!selectedSchedule) return alert("Vui lòng chọn lịch trình để xoá!");
              handleDelete(selectedSchedule.id);
            }} 
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 shadow-md transition">
            Xóa
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Tên lịch trình</th>
                <th className="px-6 py-4 text-left font-medium">Tuyến đường</th>
                <th className="px-6 py-4 text-left font-medium">Kỳ hoạt động</th>
                <th className="px-6 py-4 text-center font-medium">Đón - Trả học sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr key="empty-row">
                  <td colSpan={4} className="text-center py-20 text-gray-500 text-lg">
                    Chưa có lịch trình nào
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                      key={s.id}
                      onClick={() => handleRowClick(s.id)}
                      className={`cursor-pointer transition 
                                  ${selectedSchedule?.id === s.id ? "bg-green-100" : "hover:bg-gray-50"}
                                `}
                    >
                    <td className="px-6 py-5 font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-5 text-gray-700">{s.routeName}</td>
                    <td className="px-6 py-5 text-gray-600">
                      {new Date(s.dateStart).toLocaleDateString("vi-VN")} to{" "}
                      {new Date(s.dateEnd).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => openDetail(s)}
                        className="text-green-600 hover:text-green-800 font-semibold underline transition"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchSchedules}
        initialData={editData}
        editMode={true}
      />

      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchSchedules}   // ← quan trọng: reload danh sách sau khi tạo
      />

      {/* Modal Chi tiết */}
      {selectedSchedule && (
        <DetailScheduleModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          scheduleId={selectedSchedule.id}
        />
      )}
    </div>
  );
}