// components/AddScheduleModal/Step2StudentSelection.tsx
import { useState } from "react";

const allStudents = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 10))} ${i + 1}`,
}));

export default function Step2StudentSelection({
  route,
  selectedStudents,
  setSelectedStudents,
  onBack,
  onConfirm,
}: any) {
  const [search, setSearch] = useState("");
  const filtered = allStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: number) => {
    setSelectedStudents((prev: number[]) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedStudents(selectedStudents.length === allStudents.length ? [] : allStudents.map(s => s.id));
  };

  // Khởi tạo mặc định chọn hết khi vào bước 2
  if (selectedStudents.length === 0) {
    setSelectedStudents(allStudents.map(s => s.id));
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">
        Danh sách học sinh trên tuyến: <span className="text-green-600">{route || "Chưa chọn"}</span>
      </h3>

      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm học sinh..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-5 py-3 border rounded-lg focus:border-green-500"
        />
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="max-h-96 overflow-y-auto border rounded-lg">
        {filtered.map(s => (
          <label key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 border-b cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStudents.includes(s.id)}
              onChange={() => toggle(s.id)}
              className="w-5 h-5 text-green-600 rounded"
            />
            <span>{s.name}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <button onClick={toggleAll} className="text-cyan-600 font-medium hover:underline">
          {selectedStudents.length === allStudents.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-3 border rounded-lg hover:bg-gray-100 text-red-600">Quay lại</button>
          <button onClick={onConfirm} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">Xác nhận</button>
        </div>
      </div>
    </div>
  );
}