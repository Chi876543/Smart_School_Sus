"use client";

import { useEffect, useState } from "react";
import AddScheduleModal from "./AddScheduleModal/AddScheduleModal";
import DetailScheduleModal from "./DetailScheduleModal";
import api from "@/services/api";
import SearchBar from "./searchBar/searchBar";
import Toast from "./toast/toast";

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
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editData, setEditData] = useState<any>(null);

  // Toast states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  type ToastType = "success" | "error";
  const [toast, setToast] = useState<{msg:string;type:ToastType} | null>(null);

  // Các bộ lọc trạng thái
  const periodFilters = [
    { label: "Tất cả", value: "all" },
    { label: "Đang diễn ra", value: "active" },
    { label: "Sắp diễn ra", value: "upcoming" },
    { label: "Đã kết thúc", value: "ended" }
  ];

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

  // Hiển thị toast
  const showToast = (msg: string, type: ToastType = "success", duration = 4000) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
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

  // Xử lý thay đổi bộ lọc trạng thái
  const onFilterStatusChange = (value: string) => {
    setFilterStatus(value);
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

  // Lọc theo trạng thái
  useEffect(() => {
    const now = new Date();

    let result = [...schedules];

    result = result.filter((s) => {
      const start = new Date(s.dateStart);
      const end = new Date(s.dateEnd);

      if (filterStatus === "active") {
        return start <= now && now <= end;
      }
      if (filterStatus === "upcoming") {
        return start > now;
      }
      if (filterStatus === "ended") {
        return end < now;
      }

      return true; // all
    });

    setFiltered(result);
  }, [filterStatus, schedules]);


  // Tìm kiếm
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(schedules);
      return;
    }
    const term = searchTerm.toLowerCase();
    
    // Tìm theo tên và tuyến đường
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
      showToast("Vui lòng chọn 1 lịch trình để sửa!", "error")
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
      showToast(deleteErrorMessage, "error")
      return;
    }
    setShowDeleteConfirm(id);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/schedules/${showDeleteConfirm}`);
      if (res.status != 200) throw new Error(await res.statusText || "Xóa thất bại!");

      showToast("Xóa lịch trình thành công!", "error")
      fetchSchedules();
    } catch (err: any) {
      setDeleteErrorMessage(err.message || "Có lỗi xảy ra");
      showToast(deleteErrorMessage, "error")
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Gọi khi tạo thành công (bạn có thể gọi từ AddScheduleModal nếu muốn)
  const handleCreateSuccess = () => {
    showToast("Tạo lịch trình thành công!", "success")
    fetchSchedules();
  };

  // Gọi khi cập nhật thành công
  const handleUpdateSuccess = () => {
    showToast("Cập nhật lịch trình thành công!", "success")
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <SearchBar 
            value={searchTerm}
            placeholder="Tìm kiếm..."
            onChange={(value) => setSearchTerm(value)}
          />
          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="
                w-[34px] h-[34px]
                rounded-md border border-gray-300 
                bg-white flex items-center justify-center 
                hover:bg-gray-200 cursor-pointer
              "
            >
              <img src="/filter.svg" className="w-[28px] h-[28px]" />
            </button>

            {open && (
              <div
                className="
                  absolute top-[42px] left-0 
                  min-w-[180px]
                  bg-white border border-gray-300 rounded-lg 
                  shadow-lg py-1 z-20
                "
              >
                {periodFilters.map((p) => (
                  <div
                    key={p.value}
                    onClick={() => {
                      onFilterStatusChange(p.value);
                      setOpen(false);
                    }}
                    className={`
                      px-3 py-2 text-sm cursor-pointer
                      hover:bg-gray-100
                      ${filterStatus === p.value ? "bg-blue-100 text-blue-600 font-semibold" : ""}
                    `}
                  >
                    {p.label}
                  </div>
                ))}
              </div>
            )}
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
                showToast("Vui lòng chọn 1 lịch trình để xóa!", "error")
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
      <div 
        style={{
          marginTop: "5px"
        }}>
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

      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
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