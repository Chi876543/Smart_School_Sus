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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editData, setEditData] = useState<any>(null);

  // Toast states
  const [showSelectScheduleToast, setShowSelectScheduleToast] = useState(false);
  const [showNoScheduleSelectedToast, setShowNoScheduleSelectedToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);
  const [showDeleteErrorToast, setShowDeleteErrorToast] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  // Toast thành công mới
  const [showCreateSuccessToast, setShowCreateSuccessToast] = useState(false);
  const [showUpdateSuccessToast, setShowUpdateSuccessToast] = useState(false);

  // Lấy danh sách lịch trình
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/schedules");
      const list = Array.isArray(res.data) ? res.data : [];
      const active = list.filter((s: any) => s.status !== "cancelled");
      setSchedules(active);
      setFiltered(active);
    } catch (err) {
      console.error(err);
      setSchedules([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết lịch trình
  const fetchScheduleDetail = async (id: string) => {
    try {
      const res = await api.get(`/schedules/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Lấy tuyến đường
  const fetchRoutes = async () => {
    try {
      const res = await api.get("/schedules/routes");
      setRoutes(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
  }, []);

  // Tìm kiếm
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

  const handleRowClick = (id: string) => {
    setSelectedSchedule(schedules.find((s) => s.id === id) || null);
  };

  const openDetail = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  };

  // Sửa lịch trình
  const handleEdit = async () => {
    if (!selectedSchedule) {
      setShowSelectScheduleToast(true);
      setTimeout(() => setShowSelectScheduleToast(false), 4500);
      return;
    }

    const detail = await fetchScheduleDetail(selectedSchedule.id);
    if (!detail) return;

    const match = routes.find((r) => r.name === detail.routeName);
    setEditData({ ...detail, routeId: match?._id || "" });
    setIsEditModalOpen(true);
  };

  // Xóa lịch trình
  const handleDelete = (id: string) => {
    if (!id) {
      setDeleteErrorMessage("Không tìm thấy ID lịch trình");
      setShowDeleteErrorToast(true);
      setTimeout(() => setShowDeleteErrorToast(false), 4500);
      return;
    }
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/schedules/${showDeleteConfirm}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text() || "Xóa thất bại!");

      setShowDeleteSuccessToast(true);
      setTimeout(() => setShowDeleteSuccessToast(false), 4000);
      fetchSchedules();
    } catch (err: any) {
      setDeleteErrorMessage(err.message || "Có lỗi xảy ra");
      setShowDeleteErrorToast(true);
      setTimeout(() => setShowDeleteErrorToast(false), 5000);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Gọi khi tạo thành công (bạn có thể gọi từ AddScheduleModal nếu muốn)
  const handleCreateSuccess = () => {
    setShowCreateSuccessToast(true);
    setTimeout(() => setShowCreateSuccessToast(false), 4000);
    fetchSchedules();
  };

  // Gọi khi cập nhật thành công
  const handleUpdateSuccess = () => {
    setShowUpdateSuccessToast(true);
    setTimeout(() => setShowUpdateSuccessToast(false), 4000);
    fetchSchedules();
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
      {/* Header */}
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
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 shadow-md transition">
            Thêm
          </button>
          <button onClick={handleEdit} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 shadow-md transition">
            Sửa
          </button>
          <button
            onClick={() => {
              if (!selectedSchedule) {
                setShowNoScheduleSelectedToast(true);
                setTimeout(() => setShowNoScheduleSelectedToast(false), 4500);
                return;
              }
              handleDelete(selectedSchedule.id);
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 shadow-md transition"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Bảng */}
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
                <tr>
                  <td colSpan={4} className="text-center py-20 text-gray-500 text-lg">
                    Chưa có lịch trình nào
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleRowClick(s.id)}
                    className={`cursor-pointer transition ${selectedSchedule?.id === s.id ? "bg-green-100" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-6 py-5 font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-5 text-gray-700">{s.routeName}</td>
                    <td className="px-6 py-5 text-gray-600">
                      {new Date(s.dateStart).toLocaleDateString("vi-VN")} → {new Date(s.dateEnd).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={(e) => { e.stopPropagation(); openDetail(s); }} className="text-green-600 hover:text-green-800 font-semibold underline transition">
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

      {/* Tất cả Toast */}
      {/* Chưa chọn để sửa */}
      {showSelectScheduleToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-red-600">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-semibold text-lg">Chưa chọn lịch trình</p>
            <p className="text-sm opacity-90">Vui lòng chọn một lịch trình để chỉnh sửa.</p>
          </div>
          <button onClick={() => setShowSelectScheduleToast(false)} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      {/* Chưa chọn để xóa */}
      {showNoScheduleSelectedToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-red-600">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-semibold text-lg">Chưa chọn lịch trình</p>
            <p className="text-sm opacity-90">Vui lòng chọn một lịch trình để xóa.</p>
          </div>
          <button onClick={() => setShowNoScheduleSelectedToast(false)} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      {/* Tạo thành công */}
      {showCreateSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
         
          <span className="font-semibold text-lg">Tạo lịch trình thành công!</span>
          <button onClick={() => setShowCreateSuccessToast(false)} className="ml-4 text-xl hover:opacity-70">×</button>
        </div>
      )}

      {/* CẬP NHẬT THÀNH CÔNG - MỚI THÊM */}
      {showUpdateSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
          
          <div>
            <p className="font-semibold text-lg">Cập nhật thành công!</p>
            <p className="text-sm opacity-90">Lịch trình đã được lưu thay đổi.</p>
          </div>
          <button onClick={() => setShowUpdateSuccessToast(false)} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      {/* Xóa thành công */}
      {showDeleteSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
         
          <span className="font-semibold text-lg">Xóa lịch trình thành công!</span>
          <button onClick={() => setShowDeleteSuccessToast(false)} className="ml-4 text-xl hover:opacity-70">×</button>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
               
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa?</h3>
              <p className="text-gray-600 text-sm mb-8">Lịch trình này sẽ bị xóa vĩnh viễn.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} disabled={deleteLoading} className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Hủy bỏ
              </button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70">
                {deleteLoading ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          handleCreateSuccess();
          setIsAddModalOpen(false);
        }}
      />

      {/* Modal Sửa */}
      <AddScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          handleUpdateSuccess();
          setIsEditModalOpen(false);
        }}
        initialData={editData}
        editMode={true}
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