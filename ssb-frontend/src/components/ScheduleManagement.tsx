// components/ScheduleManagement.tsx
"use client";

import { useEffect, useState } from "react";
import AddScheduleModal from "./AddScheduleModal/AddScheduleModal";
import DetailScheduleModal from "./DetailScheduleModal";
import { api } from "@/lib/api";

interface Schedule {
  _id: string;
  name: string;
  route: { _id: string; name: string };
  dateStart: string;  // Đổi từ periodStart
  dateEnd: string;    // Đổi từ periodEnd
}

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filtered, setFiltered] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const fetchSchedules = async () => {
    try {
      const data = await api<Schedule[]>("/schedules/management");
      setSchedules(data);
      setFiltered(data);
    } catch {
      alert("Không tải được danh sách lịch trình");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = schedules.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.route.name.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [searchTerm, schedules]);

  const handleDelete = async () => {
    if (!selectedSchedule) {
      alert("Vui lòng chọn 1 lịch trình để xóa");
      return;
    }
    if (!confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) return;

    try {
      await api(`/schedules/${selectedSchedule._id}`, { method: "DELETE" });
      setSchedules((prev) => prev.filter((s) => s._id !== selectedSchedule._id));
      setSelectedSchedule(null);
      alert("Xóa thành công!");
    } catch {
      alert("Xóa thất bại");
    }
  };

  const handleEdit = (sch: Schedule) => {
    setEditingSchedule(sch);
    setIsAddModalOpen(true);
  };

  const openDetail = (sch: Schedule) => {
    setSelectedSchedule(sch);
    setIsDetailModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSchedule(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tìm kiếm + Nút */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition"
                />
                <svg
                  className="absolute left-4 top-4 w-5 h-5 text-gray-400"
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
                onClick={() => {
                  setEditingSchedule(null);
                  setIsAddModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm
              </button>

              <button
                onClick={() => selectedSchedule && handleEdit(selectedSchedule)}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm transition ${
                  selectedSchedule
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedSchedule}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Sửa
              </button>

              <button
                onClick={handleDelete}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm transition ${
                  selectedSchedule
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedSchedule}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2.175 2.175 0 0116.138 21H7.862a2.175 2.175 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Tên lịch trình</th>
                <th className="px-6 py-4 text-left font-medium">Tuyến đường</th>
                <th className="px-6 py-4 text-left font-medium">Kỳ hoạt động</th>
                <th className="px-6 py-4 text-center font-medium">Đón - Trả học sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-500 text-lg">
                    Chưa có lịch trình nào
                  </td>
                </tr>
              ) : (
                filtered.map((s: any) => (
                  <tr
                    key={s._id}
                    className={`hover:bg-gray-50 transition cursor-pointer ${
                      selectedSchedule?._id === s._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedSchedule(s)}
                  >
                    <td className="px-6 py-4 font-medium">{s.name || "Chưa đặt tên"}</td>

                    {/* Tuyến đường – giờ đã có dữ liệu */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {s.route.name}
                    </td>

                    {/* Kỳ hoạt động */}
                    <td className="px-6 py-4">
                      {s.dateStart && s.dateEnd
                        ? `${new Date(s.dateStart).toLocaleDateString("vi-VN")} - ${new Date(s.dateEnd).toLocaleDateString("vi-VN")}`
                        : "Chưa xác định"}
                    </td>

                    {/* Xem chi tiết */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(s);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
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

      {/* Modals */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        editingSchedule={editingSchedule}
        onSuccess={() => {
          fetchSchedules();
          closeAddModal();
        }}
      />

      <DetailScheduleModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        scheduleId={selectedSchedule?._id || ""}
      />
    </div>
  );
}