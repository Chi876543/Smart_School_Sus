// components/AddScheduleModal/Step1ScheduleInfo.tsx
import { useEffect, useState } from "react";

interface Route {
  _id: string;
  name: string;
}

interface Timetable {
  id: string;
  dayOfWeek: string;
  pickupTime: string;
  dropoffTime: string;
}

interface Props {
  scheduleName: string;
  setScheduleName: (v: string) => void;
  routeId: string;
  setRouteId: (v: string) => void;
  periodStart: string;
  setPeriodStart: (v: string) => void;
  periodEnd: string;
  setPeriodEnd: (v: string) => void;
  timeRows: { timetableId: string; day: string; pick: string; drop: string }[];
  setTimeRows: (rows: any[]) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function Step1ScheduleInfo({
  scheduleName, setScheduleName,
  routeId, setRouteId,
  periodStart, setPeriodStart,
  periodEnd, setPeriodEnd,
  timeRows, setTimeRows,
  onNext, onCancel
}: Props) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [routesRes, timetablesRes] = await Promise.all([
          fetch("http://localhost:8080/schedules/routes"),
          fetch("http://localhost:8080/schedules/timetables")
        ]);

        if (!routesRes.ok) throw new Error("Không tải được tuyến đường");
        if (!timetablesRes.ok) throw new Error("Không tải được thời khóa biểu");

        const routesData = await routesRes.json();
        const timetablesData = await timetablesRes.json();

        // QUAN TRỌNG: Đảm bảo luôn là mảng
        const routeList: Route[] = Array.isArray(routesData)
          ? routesData.map((r: any) => ({ _id: r._id.toString(), name: r.name }))
          : [];

        const timetableList: Timetable[] = Array.isArray(timetablesData)
          ? timetablesData.map((t: any) => ({
              id: t._id?.toString(),          
              dayOfWeek: t.dayOfWeek,
              pickupTime: t.pickupTime,
              dropoffTime: t.dropoffTime
            }))
          : [];

        setRoutes(routeList);
        setTimetables(timetableList);

        if (routeList.length === 0) setError("Chưa có tuyến đường nào");
        if (timetableList.length === 0) setError("Chưa có thời khóa biểu nào");

      } catch (err: any) {
        console.error(err);
        setError("Lỗi tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addRow = () => {
    setTimeRows([...timeRows, { timetableId: "", day: "", pick: "", drop: "" }]);
  };

  const updateRow = (i: number, field: string, value: string) => {
    const updated = [...timeRows];
    updated[i] = { ...updated[i], [field]: value };

    if (field === "timetableId" && value) {
      const tt = timetables.find(t => t.id === value);
      if (tt) {
        updated[i].day = tt.dayOfWeek;
        updated[i].pick = tt.pickupTime;
        updated[i].drop = tt.dropoffTime;
      }
    }
    setTimeRows(updated);
  };

  const removeRow = (i: number) => {
    setTimeRows(timeRows.filter((_, idx) => idx !== i));
  };

  if (loading) {
    return <div className="text-center py-16 text-xl text-gray-600">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 underline">
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tên lịch trình */}
      <div>
        <label className="block text-lg font-semibold mb-2">Tên lịch trình</label>
        <input
          type="text"
          value={scheduleName}
          onChange={e => setScheduleName(e.target.value)}
          placeholder="VD: Lịch đưa đón tháng 11/2025"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Tuyến đường */}
      <div>
        <label className="block text-lg font-semibold mb-2">Tuyến đường</label>
        <select
          value={routeId}
          onChange={e => setRouteId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Chọn tuyến đường --</option>
          {routes.map(r => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Thời gian hoạt động */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Ngày bắt đầu</label>
          <input
            type="date"
            value={periodStart}
            onChange={e => setPeriodStart(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Ngày kết thúc</label>
          <input
            type="date"
            value={periodEnd}
            onChange={e => setPeriodEnd(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Thời khóa biểu */}
      <div>
        <label className="block text-lg font-semibold mb-4">Thời khóa biểu</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Chọn TKB</th>
                <th className="px-4 py-3 text-center">Thứ</th>
                <th className="px-4 py-3 text-center">Giờ đón</th>
                <th className="px-4 py-3 text-center">Giờ trả</th>
                <th className="px-4 py-3 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {timeRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Chưa chọn ngày nào
                  </td>
                </tr>
              ) : (
                timeRows.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">
                      <select
                        value={row.timetableId}
                        onChange={e => updateRow(i, "timetableId", e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                      >
                        <option value="">-- Chọn --</option>
                        {timetables.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.dayOfWeek} ({t.pickupTime} - {t.dropoffTime})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center font-medium">{row.day || "-"}</td>
                    <td className="text-center text-green-600 font-medium">{row.pick || "-"}</td>
                    <td className="text-center text-red-600 font-medium">{row.drop || "-"}</td>
                    <td className="text-center">
                      <button onClick={() => removeRow(i)} className="text-red-600 hover:text-red-800 text-xl">
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button onClick={addRow} className="mt-4 text-cyan-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
          <span className="text-3xl">+</span> Thêm ngày chạy
        </button>
      </div>

      {/* Nút điều khiển */}
      <div className="flex justify-between pt-8 border-t border-gray-300">
        <button
          onClick={onCancel}
          className="px-8 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Hủy bỏ
        </button>
        <button
          onClick={onNext}
          disabled={!scheduleName || !routeId || !periodStart || !periodEnd || timeRows.length === 0 || timeRows.some(r => !r.timetableId)}
          className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          Tiếp theo →
        </button>
      </div>
    </div>
  );
}