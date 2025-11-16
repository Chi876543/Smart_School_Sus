// components/AddScheduleModal/Step1ScheduleInfo.tsx
const routes = ["Tuyển Quận 1", "Tuyển Thủ Đức", "Tuyển Quận 5", "Tuyển Bình Thạnh", "Tuyển Gò Vấp"];

export default function Step1ScheduleInfo({
  scheduleName, setScheduleName,
  route, setRoute,
  periodStart, setPeriodStart,
  periodEnd, setPeriodEnd,
  timeRows, setTimeRows,
  onNext, onCancel
}: any) {
  const addRow = () => setTimeRows([...timeRows, { day: "", pick: "", drop: "" }]);
  const updateRow = (i: number, field: string, v: string) => {
    const updated = [...timeRows];
    updated[i] = { ...updated[i], [field]: v };
    setTimeRows(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-2">Tên:</label>
        <input type="text" value={scheduleName} onChange={e => setScheduleName(e.target.value)} placeholder="Nhập tên lịch trình..." className="w-full px-4 py-3 border rounded-lg focus:border-green-500" />
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Tuyến đường:</label>
        <select value={route} onChange={e => setRoute(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
          <option value="">Vui lòng chọn tuyến</option>
          {routes.map(r => <option key={r} value={r}>{r}</option>)}
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
              <tr><th className="px-6 py-3">Thứ</th><th className="px-6 py-3">Thời gian đón</th><th className="px-6 py-3">Thời gian trả</th></tr>
            </thead>
            <tbody>
              {timeRows.map((row: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-3"><input type="text" value={row.day} onChange={e => updateRow(i, "day", e.target.value)} placeholder="Thứ 2" className="w-full px-2 py-1 border-0" /></td>
                  <td className="px-6 py-3"><input type="time" value={row.pick} onChange={e => updateRow(i, "pick", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="px-6 py-3"><input type="time" value={row.drop} onChange={e => updateRow(i, "drop", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
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
        <button onClick={onNext} className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">Tiếp theo</button>
      </div>
    </div>
  );
}