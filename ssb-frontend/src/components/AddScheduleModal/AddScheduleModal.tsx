// components/AddScheduleModal/AddScheduleModal.tsx
"use client";

import { useState } from "react";
import Step1ScheduleInfo from "./Step1ScheduleInfo";
import Step2StudentSelection from "./Step2StudentSelection";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddScheduleModal({ isOpen, onClose }: AddScheduleModalProps) {
  const [step, setStep] = useState(1);

  // Dữ liệu chung giữa 2 bước
  const [scheduleName, setScheduleName] = useState("");
  const [route, setRoute] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [timeRows, setTimeRows] = useState([{ day: "", pick: "", drop: "" }]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const resetAndClose = () => {
    setStep(1);
    setScheduleName("");
    setRoute("");
    setPeriodStart("");
    setPeriodEnd("");
    setTimeRows([{ day: "", pick: "", drop: "" }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={resetAndClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 text-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Thêm lịchXFF trình</h2>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <Step1ScheduleInfo
              scheduleName={scheduleName}
              setScheduleName={setScheduleName}
              route={route}
              setRoute={setRoute}
              periodStart={periodStart}
              setPeriodStart={setPeriodStart}
              periodEnd={periodEnd}
              setPeriodEnd={setPeriodEnd}
              timeRows={timeRows}
              setTimeRows={setTimeRows}
              onNext={() => setStep(2)}
              onCancel={resetAndClose}
            />
          ) : (
            <Step2StudentSelection
              route={route}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              onBack={() => setStep(1)}
              onConfirm={() => {
                alert("Đã lưu lịch trình thành công!");
                resetAndClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}