// components/AddScheduleModal/Step2StudentSelection.tsx
import { useEffect, useState } from "react";

interface Student { id: string; name: string; }

interface Props {
  routeId: string;
  selectedStudents: string[];
  setSelectedStudents: (s: string[]) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function Step2StudentSelection({
  routeId, selectedStudents, setSelectedStudents, onBack, onConfirm, loading
}: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!routeId) return;
    setFetching(true);
    fetch(`http://localhost:8080/students/by-route/${routeId}`)
      .then(r => r.ok ? r.json() : Promise.reject("Lỗi tải học sinh"))
      .then(data => setStudents(data))
      .catch(() => { alert("Không tải được học sinh"); setStudents([]); })
      .finally(() => setFetching(false));
  }, [routeId]);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedStudents(selectedStudents.length === filtered.length ? [] : filtered.map(s => s.id));
  };

  if (fetching) return <div className="text-center py-12 text-lg">Đang tải học sinh...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Chọn học sinh</h3>

      <input
        type="text" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:border-green-500"
      />

      <div className="max-h-96 overflow-y-auto border rounded-lg bg-gray-50">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Không có học sinh</div>
        ) : (
          filtered.map(s => (
            <label key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white border-b cursor-pointer">
              <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggle(s.id)}
                className="w-5 h-5 text-green-600 rounded" />
              <span className="text-lg">{s.name}</span>
            </label>
          ))
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button onClick={toggleAll} className="text-cyan-600 font-medium hover:underline">
          {selectedStudents.length === filtered.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>

        <div className="flex gap-4">
          <button onClick={onBack} className="px-8 py-3 border border-gray-300 rounded-lg text-red-600 hover:bg-gray-50">
            Quay lại
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || selectedStudents.length === 0}
            className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Đang tạo..." : "Tạo lịch trình"}
          </button>
        </div>
      </div>
    </div>
  );
}