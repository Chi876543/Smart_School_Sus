// components/ScheduleManagement.tsx
"use client";

import { useState } from "react";
import AddScheduleModal from "./AddScheduleModal/AddScheduleModal";
import DetailScheduleModal from "./DetailScheduleModal";

export default function ScheduleManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  const [schedules, setSchedules] = useState([
    { id: 1, name: "Tuyển Quận 1 - Tuần 1 - Tháng 10/2025", route: "Tuyển Quận 1", period: "01/10 - 07/10/2025" },
    { id: 2, name: "Tuyển Thủ Đức - Tuần 1 - Tháng 10/2025", route: "Tuyển Thủ Đức", period: "01/10 - 07/10/2025" },
    { id: 3, name: "Tuyển Quận 5 - Tuần 2 - Tháng 10/2025", route: "Tuyển Quận 5", period: "08/10 - 15/10/2025" },
  ]);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      alert("Xóa thành công!");
    }
  };

  const handleEdit = (sch: any) => {
    setEditingSchedule(sch);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* CARD TRẮNG CHỨA TOÀN BỘ NỘI DUNG QUẢN LÝ LỊCH TRÌNH */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* PHẦN NÚT THÊM - SỬA - XÓA + TÌM KIẾM – ĐÚNG VỊ TRÍ ẢNH */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {/* Tìm kiếm */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
                <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 3 NÚT THÊM - SỬA - XÓA */}
            <div className="flex gap-3">
              <button
                onClick={() => { setEditingSchedule(null); setIsAddModalOpen(true); }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sửa
              </button>

              <button
                onClick={() => alert("Vui lòng chọn 1 lịch trình để xóa")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2.175 2.175 0 0116.138 21H7.862a2.175 2.175 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* BẢNG DANH SÁCH */}
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
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.route}</td>
                  <td className="px-6 py-4">{s.period}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setIsDetailModalOpen(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS – GIỮ NGUYÊN ĐẸP NHƯ TRƯỚC */}
      <AddScheduleModal isOpen={isAddModalOpen} onClose={closeAddModal} editingSchedule={editingSchedule} />
      <DetailScheduleModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
    </div>
  );
}