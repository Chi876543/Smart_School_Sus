// src/components/AddScheduleModal/AddScheduleModal.tsx
"use client";

import { useEffect, useState } from "react";
import Step1ScheduleInfo from "./Step1ScheduleInfo";
import Step2StudentSelection from "./Step2StudentSelection";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  editMode?: boolean;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  editMode: isEditMode = false,
}: AddScheduleModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [scheduleName, setScheduleName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [timeRows, setTimeRows] = useState<
    { timetableId: string; day: string; pick: string; drop: string }[]
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setStep(1);
    setScheduleName("");
    setRouteId("");
    setPeriodStart("");
    setPeriodEnd("");
    setTimeRows([]);
    setSelectedStudents([]);
    setEditId(null);
  };

  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setEditId(initialData._id);
      setScheduleName(initialData.name || "");
      setRouteId(initialData.routeId?._id || initialData.routeId || "");
      setPeriodStart(initialData.dateStart?.split("T")[0] || "");
      setPeriodEnd(initialData.dateEnd?.split("T")[0] || "");
      setTimeRows(
        (initialData.timeTables || []).map((t: any) => ({
          timetableId: t._id || "",
          day: t.dayOfWeek || "",
          pick: t.pickupTime || "",
          drop: t.dropoffTime || "",
        }))
      );
      setSelectedStudents(initialData.students?.map((s: any) => s._id || s) || []);
    } else if (isOpen && !isEditMode) {
      resetForm();
    }
  }, [isOpen, initialData, isEditMode]);

  const handleSubmit = async () => {
    if (!periodStart || !periodEnd || periodStart >= periodEnd) {
      alert("Ngày bắt đầu phải trước ngày kết thúc!");
      return;
    }
    if (!scheduleName.trim() || !routeId || timeRows.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const isEdit = isEditMode && editId;
      const url = isEdit
        ? `http://localhost:8080/schedules/${editId}`
        : "http://localhost:8080/schedules/create";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: scheduleName.trim(),
          routeId,
          dateStart: new Date(periodStart).toISOString(),
          dateEnd: new Date(periodEnd).toISOString(),
          timeTables: timeRows.map(r => r.timetableId).filter(Boolean),
          students: selectedStudents,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Lỗi server");
      }

      alert(isEdit ? "Cập nhật thành công!" : "Tạo lịch trình thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={() => { onClose(); resetForm(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center rounded-t-2xl">
          <h2 className="text-3xl font-bold">
            {isEditMode ? "Chỉnh sửa lịch trình" : "Thêm lịch trình mới"}
          </h2>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <Step1ScheduleInfo
              scheduleName={scheduleName} setScheduleName={setScheduleName}
              routeId={routeId} setRouteId={setRouteId}
              periodStart={periodStart} setPeriodStart={setPeriodStart}
              periodEnd={periodEnd} setPeriodEnd={setPeriodEnd}
              timeRows={timeRows} setTimeRows={setTimeRows}
              onNext={() => periodStart < periodEnd ? setStep(2) : alert("Ngày bắt đầu phải trước ngày kết thúc!")}
              onCancel={() => { onClose(); resetForm(); }}
            />
          ) : (
            <Step2StudentSelection
              routeId={routeId}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              onBack={() => setStep(1)}
              onConfirm={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}