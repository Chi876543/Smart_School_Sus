// src/components/ScheduleManagement.tsx
"use client";

import { useEffect, useState } from "react";
import AddScheduleModal from "./AddScheduleModal/AddScheduleModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DetailScheduleModal from "./DetailScheduleModal"; // Đảm bảo bạn đã có file này

interface Schedule {
  _id: string;
  name: string;
  routeName: string;
  dateStart: string;
  dateEnd: string;
}

const API_URL = "http://localhost:8080";

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filtered, setFiltered] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal Thêm/Sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  // Modal Xem chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSchedule, setDetailSchedule] = useState<any>(null);

  // Modal Xóa
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/schedules`);
      if (!res.ok) throw new Error("Không lấy được dữ liệu");
      const data = await res.json();
      setSchedules(data);
      setFiltered(data);
    } catch (err) {
      alert("Không kết nối được backend (port 8080)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      schedules.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.routeName?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, schedules]);

const handleRowClick = (id: string, e: React.MouseEvent) => {
  e.stopPropagation();

  if (e.ctrlKey || e.metaKey) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  } else {
    setSelectedIds(new Set([id]));
  }
};


  const handleEdit = () => {
    if (selectedIds.size !== 1) {
      alert("Vui lòng chọn đúng 1 lịch trình để sửa!");
      return;
    }
    const id = Array.from(selectedIds)[0];
    const sch = schedules.find((s) => s._id === id);
    if (sch) {
      setEditingSchedule(sch);
      setModalOpen(true);
    }
  };

  const handleView = (schedule: any) => {
    setDetailSchedule(schedule);
    setDetailOpen(true);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      const results = await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`${API_URL}/schedules/${id}`, { method: "DELETE" })
        )
      );
      const failed = results.some((r) => !r.ok);
      alert(
        failed
          ? "Có lỗi khi xóa một số lịch trình!"
          : `Đã xóa thành công ${selectedIds.size} lịch trình!`
      );
      fetchSchedules();
      setSelectedIds(new Set());
      setDeleteOpen(false);
    } catch {
      alert("Lỗi kết nối server!");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-3xl text-green-600 font-bold">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm lịch trình..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-5 py-3 border border-gray-300 rounded-lg w-full md:w-96 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setEditingSchedule(null);
              setModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Thêm
          </button>

          <button
            onClick={handleEdit}
            disabled={selectedIds.size !== 1}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition disabled:cursor-not-allowed"
          >
            Sửa
          </button>

          <button
            onClick={() => selectedIds.size === 1 && handleView(schedules.find(s => selectedIds.has(s._id)))}
            disabled={selectedIds.size !== 1}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition disabled:cursor-not-allowed"
          >
            Xem
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            disabled={selectedIds.size === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>
      </div>

{/* Bảng */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <table className="w-full">
    <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <tr>
        <th className="px-6 py-4 text-left font-semibold">Tên lịch trình</th>
        <th className="px-6 py-4 text-left font-semibold">Tuyến đường</th>
        <th className="px-6 py-4 text-left font-semibold">Kỳ hoạt động</th>
        <th className="px-6 py-4 text-left font-semibold">Đón - Trả học sinh</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {filtered.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center py-16 text-gray-500 text-lg">
            Không tìm thấy lịch trình nào
          </td>
        </tr>
      ) : (
        filtered.map((s) => (
          <tr
            key={s._id}
            onClick={(e) => handleRowClick(s._id, e)}
            className={`cursor-pointer transition-all ${
              selectedIds.has(s._id)
                ? "bg-blue-100 border-l-4 border-blue-500"
                : "hover:bg-gray-50"
            }`}
          >
            <td className="px-6 py-4 font-medium">{s.name}</td>
            <td className="px-6 py-4">{s.routeName || "-"}</td>
            <td className="px-6 py-4">
              {new Date(s.dateStart).toLocaleDateString("vi-VN")} →{" "}
              {new Date(s.dateEnd).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-6 py-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(s);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium underline transition"
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


      {/* Các Modal */}
      <AddScheduleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSchedule(null);
        }}
        onSuccess={fetchSchedules}
        initialData={editingSchedule}
        editMode={!!editingSchedule}
      />

      <DetailScheduleModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        schedule={detailSchedule}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        scheduleName={
          selectedIds.size === 1
            ? schedules.find((s) => selectedIds.has(s._id))?.name || "lịch trình"
            : `${selectedIds.size} lịch trình`
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}