// components/ScheduleManagement.tsx
"use client";

import { useState } from "react";

export default function ScheduleManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Dữ liệu giả
  const students = Array.from({ length: 45 }, (_, i) => `Nguyễn Văn A ${i + 1}`);
  const stations = [
    "Trạm 1 - Quận 1", "Trạm 2 - Lê Lợi", "Trạm 3 - Nguyễn Huệ",
    "Trạm 4 - Bùi Viện", "Trạm 5 - Phạm Ngũ Lão", "Trạm 6 - Bến Thành",
    "Trạm 7 - Chợ Lớn", "Trạm 8 - Tân Bình", "Trạm 9 - Gò Vấp", "Trạm 10 - Bình Thạnh"
  ];

  const totalPages = Math.max(
    Math.ceil(students.length / itemsPerPage),
    Math.ceil(stations.length / itemsPerPage)
  );

  const currentStudents = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const currentStations = stations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const schedules = [
    { name: "Tuyển Quận 1 - Tuần 1 - Tháng 10/2025", route: "Tuyến Quận 1", period: "01/10 - 07/10/2025" },
    { name: "Tuyển Thủ Đức - Tuần 1 - Tháng 10/2025", route: "Tuyến Thủ Đức", period: "01/10 - 07/10/2025" },
    { name: "Tuyển Quận 5 - Tuần 2 - Tháng 10/2025", route: "Tuyến Quận 5", period: "08/10 - 15/10/2025" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Quản lý lịch trình</h1>

      {/* Thanh tìm kiếm + nút hành động */}
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm lịch trình..."
            className="w-full pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-3">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium">+ Thêm</button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium">Sửa</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium">Xóa</button>
        </div>
      </div>

      {/* Bảng danh sách lịch trình */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Tên lịch trình</th>
              <th className="px-6 py-4 text-left font-semibold">Tuyến đường</th>
              <th className="px-6 py-4 text-left font-semibold">Kỳ hoạt động</th>
              <th className="px-6 py-4 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{s.route}</td>
                <td className="px-6 py-4">{s.period}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setPage(1);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-medium transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL – ĐẸP Y HỆT ẢNH BẠN GỬI */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chi tiết đón - trả học sinh</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl hover:text-gray-200">×</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Bảng giờ đón trả */}
              <div>
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Thứ</th>
                      <th className="px-6 py-3 text-left font-medium">Thời gian đón</th>
                      <th className="px-6 py-3 text-left font-medium">Thời gian trả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Thứ 2", "6:00", "16:30"],
                      ["Thứ 3", "6:00", "16:30"],
                      ["Thứ 4", "6:00", "15:30"],
                      ["Thứ 5", "N/A", "N/A"],
                      ["Thứ 6", "6:00", "16:30"],
                      ["Thứ 7", "6:00", "16:30"],
                    ].map(([day, pick, drop]) => (
                      <tr key={day} className="border-t">
                        <td className="px-6 py-4 font-medium">{day}</td>
                        <td className="px-6 py-4">{pick}</td>
                        <td className="px-6 py-4">{drop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 2 cột: Học sinh + Trạm */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách học sinh</h3>
                  <div className="space-y-3">
                    {currentStudents.map((name, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 text-gray-800">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Các trạm đón</h3>
                  <div className="space-y-3">
                    {currentStations.map((station, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 text-gray-800">
                        {station}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer phân trang */}
            <div className="bg-gray-50 border-t p-5 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Trang {page} / {totalPages}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}