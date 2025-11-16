// components/AddScheduleModal/AddScheduleModal.tsx
"use client";

import { useState } from "react";
import Step1ScheduleInfo from "./Step1ScheduleInfo";
import Step2StudentSelection from "./Step2StudentSelection";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
}

export default function AddScheduleModal({ isOpen, onClose, onCreate }: AddScheduleModalProps) {
  const [step, setStep] = useState(1);

  const [scheduleName, setScheduleName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [timeRows, setTimeRows] = useState<{ timetableId: string; day: string; pick: string; drop: string }[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const resetAndClose = () => {
    setStep(1);
    setScheduleName("");
    setRouteId("");
    setPeriodStart("");
    setPeriodEnd("");
    setTimeRows([]);
    setSelectedStudents([]);
    onClose();
  };

  const handleConfirm = async () => {
    await onCreate({
      name: scheduleName,
      routeId,
      dateStart: periodStart,
      dateEnd: periodEnd,
      timeTables: timeRows.map(r => r.timetableId),
      students: selectedStudents,
    });
    resetAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={resetAndClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 text-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Thêm lịch trình mới</h2>
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
              onNext={() => setStep(2)}
              onCancel={resetAndClose}
            />
          ) : (
            <Step2StudentSelection
              routeId={routeId}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
}