"use client";

import React, { useEffect, useState } from "react";
import AssignmentToolbar from "./AssignmentToolBar";
import styles from "./DriverAssignment.module.css";
import AssignSchedulePanel, { ScheduleInfo } from "./AssignSchedulePanel";
import Toast from "@/components/toast/toast"; 

// == API đã chuẩn hóa ==
import {
  getAssignments,
  getDrivers,
  getBuses,
  assignSchedule,
  updateAssignment,
  deleteAssignment,
  AssignmentRow,
  DriverOption,
  BusOption,
} from "../../services/assign.api";

export default function DriverAssignment() {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [data, setData] = useState<AssignmentRow[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [buses, setBuses] = useState<BusOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  // Toast
  const [showToastEdit, setShowToastEdit] = useState(false);
  const [showToastEditSuccess, setShowToastEditSuccess] = useState(false);
  const [showToastEditFail, setShowToastEditFail] = useState(false);
  const [showToastActiveSelectError, setShowToastActiveSelectError] = useState(false);
  // PANEL
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleInfo | null>(
    null
  );
  const [panelError, setPanelError] = useState<string | null>(null);
  const [initialDriverId, setInitialDriverId] = useState<string | null>(null);
  const [initialBusId, setInitialBusId] = useState<string | null>(null);

  // KHÓA SCROLL KHI PANEL MỞ
  useEffect(() => {
    if (isPanelOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // cleanup: mở lại scroll khi panel đóng / component unmount
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isPanelOpen]);
  // ====== LOAD API ======
  const reloadFromApi = async () => {
    try {
      setLoading(true);
      setError(null);

      const [schedulesRes, driversRes, busesRes] = await Promise.all([
        getAssignments(),
        getDrivers(),
        getBuses(),
      ]);

      setData(schedulesRes);
      setDrivers(driversRes);
      setBuses(busesRes);
      setSelectedIndex(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Không thể tải dữ liệu phân công");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadFromApi();
  }, []);
  const canInteract = (status: string) => {
    return (
      status === "Chưa phân công" ||
      status === "Đã phân công"
    );
  };
  const handleFilterStatusChange = (status: string) => {
    console.log("Đã chọn trạng thái:", status);
    setFilterStatus(status);
  };
  // ======= SEARCH FILTER ========
  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase().trim();

    // 1. Lọc theo search
    const matchSearch =
      !keyword ||
      item.routeName.toLowerCase().includes(keyword) ||
      item.driver.toLowerCase().includes(keyword) ||
      item.vehicle.toLowerCase().includes(keyword);

    // 2. Lọc theo status
    const matchStatus =
      filterStatus === "ALL" ? true : item.status === filterStatus;

    return matchSearch && matchStatus;
  });

  // ======= HANDLE EDIT ========
  const handleEdit = () => {
    if (selectedIndex === null) {
      setShowToastEdit(true);
      setTimeout(() => setShowToastEdit(false), 2000);
      return;
    }

    const row = filteredData[selectedIndex];

    setPanelMode("edit");

    setCurrentSchedule({
      id: row.id,
      name: row.routeName,
      status: row.status,
    });

    setInitialDriverId(row.driverId);
    setInitialBusId(row.vehicleId);
    setPanelError(null);
    setIsPanelOpen(true);
  };

  // ======= CSS STATUS ========
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Đã hoàn thành":
        return styles.statusCompleted;
      case "Đang hoạt động":
        return styles.statusActive;
      case "Đã phân công":
        return styles.statusPlanned;
      case "Tạm dừng":
        return styles.statusSuspended;
      case "Hủy bỏ":
        return styles.statusCancelled;
      case "Chưa phân công":
      default:
        return styles.statusUnassigned;
    }
  };

  return (
    <div className={styles.page}>
      <AssignmentToolbar
        searchValue={search}
        onSearch={setSearch}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        filterStatus={filterStatus}
        onFilterStatusChange={handleFilterStatusChange}
      />

      <div className={styles.tableWrapper}>
        {loading && <div style={{ padding: "8px" }}>Đang tải...</div>}
        {error && <div style={{ padding: "8px", color: "red" }}>{error}</div>}

        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colRoute}>Tên lịch trình</th>
                <th className={styles.colDriver}>Tài xế</th>
                <th className={styles.colVehicle}>Xe</th>
                <th className={styles.colStatus}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => {
              if (item.status === "cancelled"  || item.status === "Hủy bỏ") return null;

                return (
                  <tr
                    key={item.id}
                    className={
                      `${styles.row} 
                      ${selectedIndex === index ? styles.rowSelected : ""} 
                      ${!canInteract(item.status) ? styles.rowDisabled : ""}`
                    }
                    onClick={() => {
                      if (item.status === "Đang hoạt động") {
                        setShowToastActiveSelectError(true);
                        setTimeout(() => setShowToastActiveSelectError(false), 2000);
                        return;
                      }

                      // do nothing if it's disabled by other conditions
                      if (!canInteract(item.status)) return;
                        setSelectedIndex(index);
                    }}
                  >
                    <td>{item.routeName}</td>
                    <td>{item.driver}</td>
                    <td>{item.vehicle}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AssignSchedulePanel
        open={isPanelOpen}
        mode={panelMode}
        schedule={currentSchedule}
        drivers={drivers}
        buses={buses}
        initialDriverId={initialDriverId}
        initialBusId={initialBusId}
        onClose={() => {
          setIsPanelOpen(false);
          setPanelError(null);
        }}
        errorMessage={panelError}
        onSubmit={async (p) => {
          try {
            setLoading(true);
            setPanelError(null);

            await assignSchedule(p.scheduleId, p.driverId, p.busId);

            await reloadFromApi();
            setIsPanelOpen(false);
            // Hiện toast thành công
            setShowToastEditSuccess(true);
            setTimeout(() => setShowToastEditSuccess(false), 2000);
          } catch (err: any) {
            const msg =
              err.response?.data?.message ||
              err.message ||
              "Có lỗi xảy ra khi phân công lịch trình";
            
            setPanelError(msg);
            // Hiện toast thất bại
            setShowToastEditFail(true);
            setTimeout(() => setShowToastEditFail(false), 2000);
          } finally {
            setLoading(false);
          }
        }}
      />
      {/* Toast */}
      {showToastEdit && <Toast message="Vui lòng chọn 1 dòng để sửa !" type="error" />}
      {showToastEditSuccess && <Toast message="Chỉnh sửa phân công thành công !" type="success" />}
      {showToastEditFail && <Toast message="Chỉnh sửa phân công thất bại !" type="error" />}
      {showToastActiveSelectError && <Toast message="Xe đang thực hiện chuyến đi, không thể tao tác!" type="error" />}
    </div>
  );
}
