// components/AddScheduleModal/Step1ScheduleInfo.tsx
import { useEffect, useState } from "react";
import { useMemo } from "react";
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
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routesRes, timetablesRes] = await Promise.all([
          fetch("http://localhost:8080/schedules/routes"),
          fetch("http://localhost:8080/schedules/timetables")
        ]);

        if (!routesRes.ok || !timetablesRes.ok) throw new Error("Lỗi tải dữ liệu");

        const routesData = await routesRes.json();
        const timetablesData = await timetablesRes.json();

        setRoutes(Array.isArray(routesData) ? routesData.map((r: any) => ({ _id: r._id.toString(), name: r.name })) : []);
        setTimetables(Array.isArray(timetablesData)
          ? timetablesData.map((t: any) => ({
              id: t._id?.toString(),
              dayOfWeek: t.dayOfWeek,
              pickupTime: t.pickupTime,
              dropoffTime: t.dropoffTime
            }))
          : []);

      } catch (err: any) {
        setError("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addTimetable = (timetable: Timetable) => {
    const exists = timeRows.some(row => row.timetableId === timetable.id);
    if (!exists) {
      setTimeRows([...timeRows, {
        timetableId: timetable.id,
        day: timetable.dayOfWeek,
        pick: timetable.pickupTime,
        drop: timetable.dropoffTime
      }]);
    }
    setShowAddDropdown(false);
    setSearchTerm("");
  };

  const removeRow = (i: number) => {
    setTimeRows(timeRows.filter((_, idx) => idx !== i));
  };

  const formatDay = (day: string) => {
    const map: any = {
      "2": "Thứ 2", "3": "Thứ 3", "4": "Thứ 4", "5": "Thứ 5",
      "6": "Thứ 6", "7": "Thứ 7", "8": "Chủ nhật"
    };
    return map[day] || day;
  };

  const filteredTimetables = timetables.filter(t =>
    !timeRows.some(row => row.timetableId === t.id) &&
    (formatDay(t.dayOfWeek).toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.pickupTime.includes(searchTerm) ||
     t.dropoffTime.includes(searchTerm))
  );

  if (loading) return <div className="text-center py-20 text-gray-600">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Tên lịch trình */}
          <div className="mb-6">
            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium whitespace-nowrap w-32">
                Tên:
              </label>
              <input
                type="text"
                value={scheduleName}
                onChange={e => setScheduleName(e.target.value)}
                placeholder="VD: Lịch đưa đón tháng 11/2025"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Tuyến đường - ngang hàng, đồng bộ với Tên */}
          <div className="mb-6">
            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium whitespace-nowrap w-32 ">
                Tuyến đường:
              </label>
              <select
                value={routeId}
                onChange={e => setRouteId(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Vui lòng chọn tuyến</option>
                {routes.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
              {/* kỳ hoạt động */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Nhãn */}
                <label className="text-gray-700 font-medium whitespace-nowrap min-w-32">
                  Kỳ hoạt động:
                </label>

                {/* Hai ô ngày */}
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={periodStart}
                      onChange={(e) => setPeriodStart(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <span className="text-xl text-gray-500 select-none">—</span>

                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={periodEnd}
                      onChange={(e) => setPeriodEnd(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

      {/* Thời khóa biểu */}
      <div className="mb-10">
        <label className="block text-gray-700 font-medium mb-3">Thời khóa biểu:</label>

        {/* Header bảng */}
        <div className="grid grid-cols-12 gap-4 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-600 rounded-t-lg">
          <div className="col-span-3">Thứ</div>
          <div className="col-span-4 text-center">Thời gian đón</div>
          <div className="col-span-4 text-center">Thời gian trả</div>
          <div className="col-span-1"></div>
        </div>

        {/* Danh sách các ngày đã chọn (không bao giờ trùng thứ) */}
        <div className="border-x border-b border-gray-300 rounded-b-lg overflow-hidden">
          {timeRows.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Chưa chọn ngày nào</div>
          ) : (
            timeRows.map((row, index) => (
              <div
                key={row.day.toISOString()} // dùng ngày thực tế làm key
                className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-200 hover:bg-gray-50 items-center"
              >
                <div className="col-span-3 font-medium text-gray-800">
                  {formatDay(row.day)}
                </div>
                <div className="col-span-4 text-center text-green-600 font-medium">
                  {row.pick || "-"}
                </div>
                <div className="col-span-4 text-center text-red-600 font-medium">
                  {row.drop || "-"}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => {
                      const dayOfWeek = row.day.getDay();
                      setSelectedDays(prev => {
                        const next = new Map(prev);
                        next.delete(dayOfWeek);
                        return next;
                      });
                    }}
                    className="text-red-600 hover:text-red-800 text-2xl font-light leading-none select-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Nút + và Dropdown tìm kiếm - CHUẨN CHIỀU RỘNG */}
        <div className="relative -mx-6">
          <button
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className="mx-auto mt-4 block text-cyan-600 hover:text-cyan-700 font-medium text-4xl"
          >
            +
          </button>

          {showAddDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20">
              {/* Ô tìm kiếm */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm thứ, giờ đón, giờ trả..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Danh sách gợi ý */}
              <div className="max-h-64 overflow-y-auto">
                {filteredTimetables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Không tìm thấy thời khóa biểu nào</div>
                ) : (
                  filteredTimetables.map(t => (
                    <button
                      key={t.id}
                      onClick={() => addTimetable(t)}
                      className="w-full grid grid-cols-12 gap-4 px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 items-center"
                    >
                      <div className="col-span-3 font-medium text-gray-800">
                        {formatDay(t.dayOfWeek)}
                      </div>
                      <div className="col-span-4 text-center text-green-600 font-medium">
                        {t.pickupTime}
                      </div>
                      <div className="col-span-4 text-center text-red-600 font-medium">
                        {t.dropoffTime}
                      </div>
                      <div className="col-span-1"></div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút Tiếp theo */}
      <div className="flex justify-end pt-6">
        <button
          onClick={onNext}
          disabled={!scheduleName || !routeId || !periodStart || !periodEnd || timeRows.length === 0}
          className="px-10 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full shadow-md transition-colors"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}