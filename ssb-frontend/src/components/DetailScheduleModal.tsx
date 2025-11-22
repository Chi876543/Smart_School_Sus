// components/DetailScheduleModal.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

interface DetailScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
}

interface ScheduleDetail {
  scheduleId: string;
  students: { id: string; fullName: string; stopName: string }[];
  timeTables: {
    id: string;
    dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    pickupTime: string | null;
    dropoffTime: string | null;
  }[];
}

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayLabel: Record<string, string> = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};

export default function DetailScheduleModal({
  isOpen,
  onClose,
  scheduleId,
}: DetailScheduleModalProps) {
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(false);
// Lấy chi tiết lịch trình từ backend khi modal mở
  const fetchScheduleDetail = async () => {
    if (!scheduleId || !isOpen) return;
    setLoading(true);
    try {
      const res = await api.get<ScheduleDetail>(`/schedules/${scheduleId}`);
      setSchedule(res.data);
    } catch (err) {
      console.error(err);
      alert("Không tải được chi tiết lịch trình");
    } finally {
      setLoading(false);
    }
  };
// Gọi API mỗi khi modal mở hoặc scheduleId thay đổi
  useEffect(() => {
    if (isOpen) fetchScheduleDetail();
  }, [isOpen, scheduleId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-lg">Đang tải...</div>
      </div>
    );
  }
// Chuẩn bị dữ liệu học sinh để hiển thị
  const students = schedule?.students?.map(s => ({
    name: s.fullName,
    stop: s.stopName
  })) || [];
// Sắp xếp thời khóa biểu theo thứ tự tuần (Thứ 2 → Chủ nhật)
  const sortedTimeTables = schedule?.timeTables
    .slice()
    .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)) || [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] max-h-[840px] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}      
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 flex justify-center items-center relative">
          <h2 className="text-2xl font-bold">Đón - Trả học sinh</h2>
          <button
            onClick={onClose}
            className="absolute right-6 text-4xl leading-none hover:opacity-70 transition"
          >
            ×
          </button>
        </div>

        {/* Nội dung cuộn dọc */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Bảng Thời khóa biểu */}
            <div className="border border-gray-300 rounded-lg overflow-hidden text-sm">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-700">Thứ</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-700">Thời gian đón</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-700">Thời gian trả</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {sortedTimeTables.length > 0 ? (
                    sortedTimeTables.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{dayLabel[item.dayOfWeek]}</td>
                        <td className="px-5 py-3">{item.pickupTime || "N/A"}</td>
                        <td className="px-5 py-3">{item.dropoffTime || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                        Chưa có thời khóa biểu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bảng Học sinh */}
            <div className="border border-gray-300 rounded-lg overflow-hidden text-sm">
              {/* Header của học sinh */}
              <div className="bg-gray-200 px-5 py-3 flex">
                <div className="flex-1 font-medium text-gray-700">Học sinh</div>
                <div className="w-24 text-right font-medium text-gray-700">Trạm</div>
              </div>

              {/* Danh sách học sinh  */}
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-300 bg-white">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                          Chưa có học sinh
                        </td>
                      </tr>
                    ) : (
                      students.map((student, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-gray-800">{student.name}</td>
                          <td className="px-5 py-3 text-right text-gray-600 pr-8">
                            {student.stop}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}