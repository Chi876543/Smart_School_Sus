"use client";

import { useEffect, useState } from "react";
import Step1ScheduleInfo from "./Step1ScheduleInfo";
import Step2StudentSelection from "./Step2StudentSelection";
import Toast from "../toast/toast";

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

  // Reset form khi mở modal tạo mới hoặc đóng
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

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setEditId(initialData.scheduleId);
      setScheduleName(initialData.name || "");
      setRouteId(initialData.routeId);
      setPeriodStart(initialData.dateStart?.split("T")[0] || "");
      setPeriodEnd(initialData.dateEnd?.split("T")[0] || "");
      setTimeRows(
        (initialData.timeTables || []).map((t: any) => ({
          timetableId: t.id || "",
          day: t.dayOfWeek || "",
          pick: t.pickupTime || "",
          drop: t.dropoffTime || "",
        }))
      );
      setSelectedStudents(initialData.students.map((s: any) => s.id || s._id));
    } else if (isOpen && !isEditMode) {
      resetForm();
    }
  }, [isOpen, initialData, isEditMode]);

  // Kiểm tra hợp lệ để sang bước 2 (không alert, chỉ chặn)
  const canGoToNextStep = (): boolean => {
    if (!periodStart || !periodEnd) return false;
    return periodStart < periodEnd; // Phải nhỏ hơn, không được bằng
  };

  // Xử lý khi nhấn "Tiếp theo" ở Step 1
  const handleNextStep = () => {
    if (canGoToNextStep()) {
      setStep(2);
    }
    // Nếu không hợp lệ → im lặng, không cho đi tiếp (không alert)
  };

  // Gửi dữ liệu lên server
  const handleSubmit = async () => {
    // Kiểm tra ngày bắt đầu < ngày kết thúc (nghiêm ngặt)
    if (!periodStart || !periodEnd || periodStart >= periodEnd) {
      // Không hiện alert → chỉ chặn submit
      return;
    }

    if (!scheduleName.trim() || !routeId || timeRows.length === 0) {
      // Thiếu thông tin → chặn submit, không cảnh báo
      return;
    }

    setLoading(true);
    try {
      const isEdit = isEditMode && editId;
      const url = isEdit
        ? `http://localhost:8080/schedules/${editId}/update`
        : "http://localhost:8080/schedules/create";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
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
        <Toast type="error" message="Đã có lỗi xảy ra khi lưu lịch trình." />;
        return;
      }

      // Thành công → gọi callback và đóng
      onSuccess();
      onClose();
    } catch (err: any) {
      // Có lỗi mạng/server → vẫn không hiện alert (theo yêu cầu)
      console.error("Lỗi khi lưu lịch trình:", err);
      // Nếu sau này muốn hiện toast thì thêm sau, hiện tại để im lặng
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center rounded-t-2xl">
          <h2 className="text-3xl font-bold">
            {isEditMode ? "Chỉnh sửa lịch trình" : "Thêm lịch trình mới"}
          </h2>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <Step1ScheduleInfo
              scheduleName={scheduleName}
              setScheduleName={setScheduleName}
              routeId={routeId}
              setRouteId={setRouteId}
              periodStart={periodStart}
              setPeriodStart={setPeriodStart}
              periodEnd={periodEnd}
              setPeriodEnd={setPeriodEnd}
              timeRows={timeRows}
              setTimeRows={setTimeRows}
              onNext={handleNextStep} // Chỉ đi tiếp nếu ngày bắt đầu < ngày kết thúc
              onCancel={() => {
                onClose();
                resetForm();
              }}
            />
          ) : (
            <Step2StudentSelection
              routeId={routeId}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              onBack={() => setStep(1)}
              onConfirm={handleSubmit}
              loading={loading}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}