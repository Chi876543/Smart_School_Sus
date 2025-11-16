// components/AddScheduleModal/Step1ScheduleInfo.tsx
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Route {
  id: string;
  name: string;
}

interface Timetable {
  _id: string;
  dayOfWeek: string;
  pickupTime: string;
  dropoffTime: string;
}

export default function Step1ScheduleInfo({
  scheduleName, setScheduleName,
  routeId, setRouteId,
  periodStart, setPeriodStart,
  periodEnd, setPeriodEnd,
  timeRows, setTimeRows,
  onNext, onCancel
}: any) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Route[]>("/schedules/routes"),
      api<Timetable[]>("/schedules/timetables")
    ])
      .then(([routesData, timetablesData]) => {
        setRoutes(routesData);
        setTimetables(timetablesData);
      })
      .catch(() => alert("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  const addRow = () => {
    setTimeRows([...timeRows, { timetableId: "", day: "", pick: "", drop: "" }]);
  };

  const updateRow = (i: number, field: string, value: string) => {
    const updated = [...timeRows];
    updated[i] = { ...updated[i], [field]: value };
    if (field === 'timetableId' && value) {
      const tt = timetables.find(t => t._id === value);
      if (tt) {
        updated[i].day = tt.dayOfWeek;
        updated[i].pick = tt.pickupTime;
        updated[i].drop = tt.dropoffTime;
      }
    }
    setTimeRows(updated);
  };

  const removeRow = (i: number) => {
    setTimeRows(timeRows.filter((_, index) => index !== i));
  };

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-2">Tên lịch trình:</label>
        <input
          type="text"
          value={scheduleName}
          onChange={e => setScheduleName(e.target.value)}
          placeholder="Nhập tên lịch trình..."
          className="w-full px-4 py-3 border rounded-lg focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Tuyến đường:</label>
        <select
          value={routeId}
          onChange={e => setRouteId(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
        >
          <option value="">Chọn tuyến đường</option>
          {routes.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Kỳ hoạt động:</label>
        <div className="flex items-center gap-4">
          <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg" />
          <span className="text-2xl">→</span>
          <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-4">Thời khóa biểu:</label>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Chọn TKB</th>
                <th className="px-4 py-3">Thứ</th>
                <th className="px-4 py-3">Đón</th>
                <th className="px-4 py-3">Trả</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {timeRows.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">
                    <select
                      value={row.timetableId}
                      onChange={e => updateRow(i, "timetableId", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">Chọn</option>
                      {timetables.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.dayOfWeek}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1 text-center">{row.day || "-"}</td>
                  <td className="px-2 py-1 text-center text-green-600">{row.pick || "-"}</td>
                  <td className="px-2 py-1 text-center text-red-600">{row.drop || "-"}</td>
                  <td className="px-2 py-1 text-center">
                    <button onClick={() => removeRow(i)} className="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addRow} className="mt-4 flex items-center gap-2 text-cyan-600 font-medium">
          <span className="text-3xl">+</span> Thêm ngày
        </button>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button onClick={onCancel} className="px-8 py-3 border rounded-lg hover:bg-gray-100">Hủy</button>
        <button
          onClick={onNext}
          disabled={!routeId || timeRows.length === 0 || timeRows.some(r => !r.timetableId)}
          className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}