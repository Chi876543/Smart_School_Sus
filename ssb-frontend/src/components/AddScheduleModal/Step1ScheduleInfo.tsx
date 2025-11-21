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
  scheduleName,
  setScheduleName,
  routeId,
  setRouteId,
  periodStart,
  setPeriodStart,
  periodEnd,
  setPeriodEnd,
  timeRows,
  setTimeRows,
  onNext,
  onCancel
}: Props) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [scheduleNameError, setScheduleNameError] = useState("");
  // Tải danh sách tuyến đường và thời khóa biểu khi component mount
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
  // Hàm kiểm tra tên hợp lệ
const validateScheduleName = (name: string): string => {
      if (name.length > 0 && name.length < 10) {
        return "Tên lịch trình phải có ít nhất 10 ký tự";
      }
      // Kiểm tra ký tự đặc biệt (chỉ cho phép chữ cái, số, khoảng trắng, gạch ngang, gạch dưới)
      const regex = /^[a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ\s\-_]+$/;
      if (name && !regex.test(name)) {
        return "Tên không được chứa ký tự đặc biệt (chỉ cho phép chữ, số, khoảng trắng, -, _)";
      }
      return "";
    };
    // Thêm một thời khóa biểu vào danh sách đã chọn
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
// Xóa một dòng thời khóa biểu khỏi danh sách đã chọn
  const removeRow = (i: number) => {
    setTimeRows(timeRows.filter((_, idx) => idx !== i));
  };
// Chuyển số thứ trong tuần thành tên tiếng Việt
  const formatDay = (day: string) => {
    const map: any = {
      "2": "Thứ 2", "3": "Thứ 3", "4": "Thứ 4", "5": "Thứ 5",
      "6": "Thứ 6", "7": "Thứ 7", "8": "Chủ nhật"
    };
    return map[day] || day;
  };
// Lọc danh sách thời khóa biểu để hiển thị trong dropdown tìm kiếm
  const filteredTimetables = timetables.filter(t => {
    const dayExists = timeRows.some(row => row.day === t.dayOfWeek);
    if (dayExists) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      formatDay(t.dayOfWeek).toLowerCase().includes(searchLower) ||
      t.pickupTime.includes(searchTerm) ||
      t.dropoffTime.includes(searchTerm)
    );
  });

  if (loading) return <div className="text-center py-20 text-gray-600">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Tên lịch trình */}
      <div className="mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="text-gray-700 font-medium whitespace-nowrap w-32">
              Tên:
            </label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={scheduleName}
                onChange={e => {
                  const value = e.target.value;
                  setScheduleName(value);
                  setScheduleNameError(validateScheduleName(value));
                }}
                placeholder="VD: Lịch đưa đón tháng 11/2025"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all ${
                  scheduleNameError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Dòng báo lỗi hiện ngay bên dưới input */}
          {scheduleNameError && (
            <div className="flex items-start gap-6">
              <div className="w-32"></div> {/* Để căn lề đều với label */}
              <p className="text-red-500 text-sm font-medium flex-1 -mt-1">
                {scheduleNameError}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tuyến đường */}
      <div className="mb-6">
        <div className="flex items-center gap-6">
          <label className="text-gray-700 font-medium whitespace-nowrap w-32">
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

      {/* Kỳ hoạt động */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-gray-700 font-medium whitespace-nowrap min-w-32">
            Kỳ hoạt động:
          </label>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1">
              <input
                type="date"
                value={periodStart}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const selected = e.target.value;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const selectedDate = new Date(selected);

                  if (!selected || selectedDate >= today) {
                    setPeriodStart(selected);
                    setStartDateError(""); // Xóa lỗi nếu hợp lệ
                  } else {
                    // Không cập nhật state + hiển thị lỗi
                    setStartDateError("Ngày bắt đầu phải từ hôm nay trở đi");
                  }
                }}
                className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                  startDateError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              {/* Thông báo lỗi */}
              {startDateError && (
                <p className="absolute -bottom-6 left-0 text-red-500 text-sm font-medium">
                  {startDateError}
                </p>
              )}
            </div>

            <span className="text-xl text-gray-500 select-none">—</span>

            <div className="relative flex-1">
            <input
              type="date"
              value={periodEnd}
              min={
                periodStart
                  ? new Date(new Date(periodStart).getTime() + 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

        {/* Danh sách đã chọn */}
        <div className="border-x border-b border-gray-300">
          {timeRows.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Chưa chọn ngày nào</div>
          ) : (
            timeRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-200 hover:bg-gray-50 items-center">
                <div className="col-span-3 font-medium text-gray-800">
                  {row.day ? formatDay(row.day) : "-"}
                </div>
                <div className="col-span-4 text-center text-green-600 font-medium">
                  {row.pick || "-"}
                </div>
                <div className="col-span-4 text-center text-red-600 font-medium">
                  {row.drop || "-"}
                </div>
                <div className="col-span-1 text-center">
                  <button onClick={() => removeRow(i)} className="text-red-600 hover:text-red-800 text-2xl">×</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Nút + và Dropdown */}
        <div className="relative -mx-6">
          <button
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className="mx-auto mt-4 block text-cyan-600 hover:text-cyan-700 font-medium text-4xl"
          >
            +
          </button>

          {showAddDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20">
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

      {/* Nút Hủy và Tiếp theo */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={onCancel}
          className="px-10 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
        >
          Hủy
        </button>

        <button
          onClick={onNext}
          disabled={
            !scheduleName || 
            !routeId || 
            !periodStart || 
            !periodEnd || 
            timeRows.length === 0 ||
            scheduleNameError !== "" ||  // Thêm điều kiện này
            scheduleName.length < 10      // Đảm bảo đủ 10 ký tự
          }
          className="px-10 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full shadow-md transition-colors"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}