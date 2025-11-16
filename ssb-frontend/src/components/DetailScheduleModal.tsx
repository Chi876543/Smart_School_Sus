// components/DetailScheduleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface DetailScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
}

interface ScheduleDetail {
  _id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  routeName: string;
  students: { name: string }[];
  stations: string[];
  totalStudents: number;
}

interface Timetable {
  dayOfWeek: string;
  pickupTime: string;
  dropoffTime: string;
}

export default function DetailScheduleModal({
  isOpen,
  onClose,
  scheduleId,
}: DetailScheduleModalProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [timetables, setTimetables] = useState<Timetable[]>([]); // Thêm state riêng
  const [loading, setLoading] = useState(false);
  const [timetableLoading, setTimetableLoading] = useState(false);

  // === 1. GỌI CHI TIẾT LỊCH TRÌNH (giữ nguyên) ===
  const fetchScheduleDetail = async () => {
    if (!scheduleId || !isOpen) return;
    setLoading(true);
    try {
      const data = await api<ScheduleDetail>(`/schedules/detail/${scheduleId}`);
      setSchedule(data);
    } catch (err) {
      alert("Không tải được chi tiết lịch trình");
    } finally {
      setLoading(false);
    }
  };

  // === 2. GỌI THỜI KHÓA BIỂU RIÊNG (mới) ===
  const fetchTimetables = async () => {
    if (!isOpen) return;
    setTimetableLoading(true);
    try {
      const data = await api<Timetable[]>("/schedules/timetables");
      setTimetables(data);
    } catch (err) {
      console.error("Lỗi tải thời khóa biểu:", err);
      setTimetables([]);
    } finally {
      setTimetableLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScheduleDetail();
      fetchTimetables(); // Gọi song song
    }
  }, [isOpen, scheduleId]);

  if (!isOpen) return null;

  if (loading || timetableLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 text-xl text-gray-600">
          Đang tải chi tiết...
        </div>
      </div>
    );
  }

  // Dữ liệu phân trang
  const students = schedule?.students.map((s) => s.name) || [];
  const stations = schedule?.stations || [];
  const totalPages = Math.ceil(Math.max(students.length, stations.length) / itemsPerPage);
  const currentStudents = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const currentStations = stations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Chi tiết đón - trả học sinh</h2>
<button
  onClick={onClose}
  className="text-4xl hover:opacity-80 transition-opacity"
>
  ×
</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Thời khóa biểu – DÙNG API RIÊNG */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Thời khóa biểu</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Thứ</th>
                    <th className="px-6 py-4 text-left font-medium">Thời gian đón</th>
                    <th className="px-6 py-4 text-left font-medium">Thời gian trả</th>
                  </tr>
                </thead>
                <tbody>
                  {timetables.length > 0 ? (
                    timetables
                      .sort((a, b) => {
                        const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
                      })
                      .map((item, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{item.dayOfWeek}</td>
                          <td className="px-6 py-4 text-green-600 font-medium">{item.pickupTime}</td>
                          <td className="px-6 py-4 text-red-600 font-medium">{item.dropoffTime}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        Chưa có thời khóa biểu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2 cột: Học sinh + Trạm đón */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Danh sách học sinh */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Danh sách học sinh</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {currentStudents.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Chưa có học sinh
                  </div>
                ) : (
                  currentStudents.map((name, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-300 rounded-lg px-5 py-3 shadow-sm hover:shadow transition"
                    >
                      {name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Các trạm đón */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Các trạm đón</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {currentStations.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Chưa có trạm đón
                  </div>
                ) : (
                  currentStations.map((station, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-300 rounded-lg px-5 py-3 shadow-sm hover:shadow transition flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      {station}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer phân trang */}
        <div className="bg-gray-50 border-t p-6 flex justify-between items-center">
          <span className="font-medium text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
            >
              Trước
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 bg-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}