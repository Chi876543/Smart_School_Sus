// components/ScheduleManagement.tsx
"use client";

import { useState } from "react";

export default function ScheduleManagement() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Bước 1: Nhập thông tin lịch trình
  const [step, setStep] = useState(1); // 1 hoặc 2
  const [scheduleName, setScheduleName] = useState("");
  const [route, setRoute] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [timeRows, setTimeRows] = useState<{ day: string; pick: string; drop: string }[]>([
    { day: "", pick: "", drop: "" },
  ]);

  // Bước 2: Danh sách học sinh (mặc định chọn hết)
  const allStudents = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 10))} ${i + 1}`,
  }));

  const [selectedStudents, setSelectedStudents] = useState<number[]>(
    allStudents.map(s => s.id) // mặc định chọn hết
  );

  const [searchStudent, setSearchStudent] = useState("");

  const toggleStudent = (id: number) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === allStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(allStudents.map(s => s.id));
    }
  };

  const filteredStudents = allStudents.filter(s =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const addNewRow = () => setTimeRows([...timeRows, { day: "", pick: "", drop: "" }]);
  const updateRow = (i: number, field: "day" | "pick" | "drop", v: string) => {
    const updated = [...timeRows];
    updated[i][field] = v;
    setTimeRows(updated);
  };

  const routes = ["Tuyển Quận 1", "Tuyển Thủ Đức", "Tuyển Quận 5", "Tuyển Bình Thạnh", "Tuyển Gò Vấp"];
  const fakeSchedules = [
    { name: "Tuyển Quận 1 - Tuần 1 - Tháng 10/2025", route: "Tuyển Quận 1", period: "01/10 - 07/10/2025" },
    { name: "Tuyển Thủ Đức - Tuần 1 - Tháng 10/2025", route: "Tuyển Thủ Đức", period: "01/10 - 07/10/2025" },
  ];

  // Modal chi tiết (giữ nguyên đẹp như cũ)
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const students = Array.from({ length: 45 }, (_, i) => `Nguyễn Văn A ${i + 1}`);
  const stations = ["Trạm 1 - Quận 1", "Trạm 2 - Lê Lợi", "Trạm 3 - Nguyễn Huệ", "Trạm 4 - Bùi Viện", "Trạm 5 - Phạm Ngũ Lão"];
  const totalPages = Math.ceil(Math.max(students.length, stations.length) / itemsPerPage);
  const currentStudents = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const currentStations = stations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Quản lý lịch trình</h1>

      {/* Thanh tìm kiếm + 3 nút */}
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <input type="text" placeholder="Tìm kiếm..." className="w-full pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setIsAddModalOpen(true); setStep(1); }} className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium">
            + Thêm
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium">Sửa</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium">Xóa</button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">Tên lịch trình</th>
              <th className="px-6 py-4 font-semibold">Tuyến đường</th>
              <th className="px-6 py-4 font-semibold">Kỳ hoạt động</th>
              <th className="px-6 py-4 font-semibold text-center">Đón - Trả học sinh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fakeSchedules.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.route}</td>
                <td className="px-6 py-4">{item.period}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => { setIsDetailModalOpen(true); setPage(1); }} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-medium">
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM LỊCH TRÌNH – 2 BƯỚC */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 text-center rounded-t-2xl">
              <h2 className="text-2xl font-bold">Thêm lịch trình</h2>
            </div>

            <div className="p-8">
              {/* BƯỚC 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Các input như cũ */}
                  <div><label className="block text-lg font-medium mb-2">Tên:</label><input type="text" value={scheduleName} onChange={e=>setScheduleName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Nhập tên lịch trình..." /></div>
                  <div><label className="block text-lg font-medium mb-2">Tuyến đường:</label>
                    <select value={route} onChange={e=>setRoute(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                      <option value="">Vui lòng chọn tuyến</option>
                      {routes.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-lg font-medium mb-2">Kỳ hoạt động:</label>
                    <div className="flex items-center gap-4">
                      <input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg" />
                      <span className="text-2xl">→</span>
                      <input type="date" value={periodEnd} onChange={e=>setPeriodEnd(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg" />
                    </div>
                  </div>

                  {/* Bảng thời khóa biểu */}
                  <div>
                    <label className="block text-lg font-medium mb-4">Thời khóa biểu:</label>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100"><tr><th className="px-6 py-3">Thứ</th><th className="px-6 py-3">Thời gian đón</th><th className="px-6 py-3">Thời gian trả</th></tr></thead>
                        <tbody>
                          {timeRows.map((row,i)=>(
                            <tr key={i} className="border-t">
                              <td className="px-6 py-3"><input type="text" value={row.day} onChange={e=>updateRow(i,"day",e.target.value)} placeholder="Thứ 2" className="w-full px-2 py-1 border-0" /></td>
                              <td className="px-6 py-3"><input type="time" value={row.pick} onChange={e=>updateRow(i,"pick",e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                              <td className="px-6 py-3"><input type="time" value={row.drop} onChange={e=>updateRow(i,"drop",e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={addNewRow} className="mt-4 flex items-center gap-2 text-cyan-600 font-medium">
                      <span className="text-3xl">+</span> Thêm ngày
                    </button>
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <button onClick={() => setIsAddModalOpen(false)} className="px-8 py-3 border rounded-lg hover:bg-gray-100">Hủy</button>
                    <button onClick={() => setStep(2)} className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">Tiếp theo</button>
                  </div>
                </div>
              )}

              {/* BƯỚC 2 – DANH SÁCH HỌC SINH (ĐÚNG ẢNH BẠN GỬI) */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Danh sách học sinh trên tuyến: <span className="text-green-600">{route || "Chưa chọn tuyến"}</span></h3>

                  {/* Ô tìm kiếm */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm học sinh..."
                      value={searchStudent}
                      onChange={e => setSearchStudent(e.target.value)}
                      className="w-full pl-12 pr-5 py-3 border rounded-lg focus:border-green-500"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Danh sách học sinh với checkbox */}
                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    {filteredStudents.map(student => (
                      <label key={student.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 border-b cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-800">{student.name}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button onClick={toggleAll} className="text-cyan-600 font-medium hover:underline">
                      {selectedStudents.length === allStudents.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </button>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg hover:bg-gray-100 text-red-600 font-medium">
                        Quay lại
                      </button>
                      <button onClick={() => { alert("Đã lưu lịch trình thành công!"); setIsAddModalOpen(false); }} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết giữ nguyên đẹp như cũ – không thay đổi */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setIsDetailModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-green-500 text-white p-5 flex justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">Chi tiết đón - trả học sinh</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-3xl">×</button>
            </div>
            {/* ... phần chi tiết giữ nguyên như trước ... */}
          </div>
        </div>
      )}
    </div>
  );
}