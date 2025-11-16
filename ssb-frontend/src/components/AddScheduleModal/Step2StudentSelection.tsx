// components/AddScheduleModal/Step2StudentSelection.tsx
import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
}

interface Step2StudentSelectionProps {
  routeId: string;
  selectedStudents: string[];
  setSelectedStudents: (students: string[]) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function Step2StudentSelection({
  routeId,
  selectedStudents,
  setSelectedStudents,
  onBack,
  onConfirm,
}: Step2StudentSelectionProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // === GỌI API QUA PROXY NEXT.JS → KHÔNG CẦN CORS ===
  useEffect(() => {
    if (!routeId) return;

    setLoading(true);

    fetch(`/api/students/by-route/${routeId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("Status:", res.status);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Danh sách học sinh:", data);
        setStudents(data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải học sinh:", err);
        alert("Không tải được học sinh. Vui lòng thử lại.");
        setStudents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routeId]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedStudents(
      selectedStudents.length === filteredStudents.length
        ? []
        : filteredStudents.map((s) => s.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Đang tải danh sách học sinh...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">
        Danh sách học sinh trên tuyến
      </h3>

      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm học sinh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
        <svg
          className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
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

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Không có học sinh nào trên tuyến này
          </div>
        ) : (
          filteredStudents.map((student) => (
            <label
              key={student.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white border-b border-gray-200 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-800 font-medium">{student.name}</span>
            </label>
          ))
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={toggleAll}
          className="text-cyan-600 font-medium hover:underline"
        >
          {selectedStudents.length === filteredStudents.length
            ? "Bỏ chọn tất cả"
            : "Chọn tất cả"}
        </button>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg text-red-600 font-medium hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedStudents.length === 0}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận tạo
          </button>
        </div>
      </div>
    </div>
  );
}