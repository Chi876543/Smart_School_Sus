"use client";
import React, { useEffect, useState } from "react";
import styles from "./AssignSchedulePanel.module.css";

export interface DriverOption {
  id: string;
  name: string;
}

export interface BusOption {
  id: string;
  plateNumber: string;
}

export interface ScheduleInfo {
  id: string;
  name: string;
  status: string;
}

export interface AssignSchedulePayload {
  scheduleId: string;
  driverId: string;
  busId: string;
}

interface Props {
  open: boolean;
  mode: "create" | "edit";
  schedule: ScheduleInfo | null;

  drivers: DriverOption[];
  buses: BusOption[];

  initialDriverId: string | null;
  initialBusId: string | null;

  onClose: () => void;
  onSubmit: (payload: AssignSchedulePayload) => void;
}

export default function AssignSchedulePanel({
  open,
  mode,
  schedule,
  drivers,
  buses,
  initialDriverId,
  initialBusId,
  onClose,
  onSubmit,
}: Props) {
  const [driverId, setDriverId] = useState("");
  const [busId, setBusId] = useState("");

  // state cho dropdown có search
  const [driverSearch, setDriverSearch] = useState("");
  const [busSearch, setBusSearch] = useState("");
  const [isDriverOpen, setIsDriverOpen] = useState(false);
  const [isBusOpen, setIsBusOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDriverId(initialDriverId || "");
      setBusId(initialBusId || "");
      setDriverSearch("");
      setBusSearch("");
      setIsDriverOpen(false);
      setIsBusOpen(false);
    }
  }, [open, initialDriverId, initialBusId]);

  if (!open || !schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!driverId || !busId) {
      alert("Vui lòng chọn đầy đủ tài xế và xe buýt.");
      return;
    }

    onSubmit({
      scheduleId: schedule.id,
      driverId,
      busId,
    });
  };

  const selectedDriver = drivers.find((d) => d.id === driverId);
  const selectedBus = buses.find((b) => b.id === busId);

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase())
  );
  const filteredBuses = buses.filter((b) =>
    b.plateNumber.toLowerCase().includes(busSearch.toLowerCase())
  );

  return (
    <div className={styles.backdrop}>
      <div className={styles.panel}>
        {/* Thanh tiêu đề màu xanh */}
        <div className={styles.headerBar}>
          <span className={styles.headerTitle}>Phân công</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tên lịch trình */}
        <div className={styles.scheduleName}>{schedule.name}</div>

        {/* Có thể hiển thị trạng thái nếu bạn muốn */}
        <div className={styles.scheduleStatusRow}>
          <span className={styles.statusLabel}>Trạng thái:</span>
          <span className={styles.statusText}>{schedule.status}</span>
        </div>

        {/* Bảng 2 cột: Tài xế / Xe buýt */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.columnsHeader}>
            <div className={styles.colHeader}>Tài xế</div>
            <div className={styles.colHeader}>Xe buýt</div>
          </div>

          <div className={styles.columnsBody}>
            {/* Cột TÀI XẾ */}
            <div className={styles.dropdownWrapper}>
              <div
                className={styles.dropdownControl}
                onClick={() => setIsDriverOpen((v) => !v)}
              >
                <span className={styles.dropdownText}>
                  {selectedDriver ? selectedDriver.name : "Chưa có"}
                </span>
                <span className={styles.dropdownArrow}>▾</span>
              </div>

              {isDriverOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.searchRow}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                      className={styles.searchInput}
                      placeholder="Tìm tài xế"
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                    />
                  </div>
                  <div className={styles.options}>
                    {filteredDrivers.map((d) => (
                      <div
                        key={d.id}
                        className={styles.option}
                        onClick={() => {
                          setDriverId(d.id);
                          setIsDriverOpen(false);
                        }}
                      >
                        {d.name}
                      </div>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <div className={styles.emptyOption}>
                        Không tìm thấy tài xế
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cột XE BUÝT */}
            <div className={styles.dropdownWrapper}>
              <div
                className={styles.dropdownControl}
                onClick={() => setIsBusOpen((v) => !v)}
              >
                <span className={styles.dropdownText}>
                  {selectedBus ? selectedBus.plateNumber : "Chưa có"}
                </span>
                <span className={styles.dropdownArrow}>▾</span>
              </div>

              {isBusOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.searchRow}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                      className={styles.searchInput}
                      placeholder="Tìm xe buýt"
                      value={busSearch}
                      onChange={(e) => setBusSearch(e.target.value)}
                    />
                  </div>
                  <div className={styles.options}>
                    {filteredBuses.map((b) => (
                      <div
                        key={b.id}
                        className={styles.option}
                        onClick={() => {
                          setBusId(b.id);
                          setIsBusOpen(false);
                        }}
                      >
                        {b.plateNumber}
                      </div>
                    ))}
                    {filteredBuses.length === 0 && (
                      <div className={styles.emptyOption}>
                        Không tìm thấy xe buýt
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nút footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
