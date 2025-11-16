"use client";

import React, { useEffect, useState } from "react";
import AssignmentToolbar from "./AssignmentToolBar";
import styles from "./DriverAssignment.module.css";
import AssignSchedulePanel, { ScheduleInfo } from "./AssignSchedulePanel";

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

  // PANEL
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleInfo | null>(
    null
  );
  const [initialDriverId, setInitialDriverId] = useState<string | null>(null);
  const [initialBusId, setInitialBusId] = useState<string | null>(null);

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

  // ======= SEARCH FILTER ========
  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;

    return (
      item.routeName.toLowerCase().includes(keyword) ||
      item.driver.toLowerCase().includes(keyword) ||
      item.vehicle.toLowerCase().includes(keyword)
    );
  });

  // ======= HANDLE ADD ========
  const handleAdd = () => {
    const target =
      selectedIndex !== null ? filteredData[selectedIndex] : filteredData[0];

    if (!target) {
      alert("Không có lịch trình nào để phân công");
      return;
    }

    setPanelMode("create");
    setCurrentSchedule({
      id: target.id,
      name: target.routeName,
      status: target.status,
    });

    setInitialDriverId(null);
    setInitialBusId(null);
    setIsPanelOpen(true);
  };

  // ======= HANDLE EDIT ========
  const handleEdit = () => {
    if (selectedIndex === null) {
      alert("Vui lòng chọn 1 dòng để sửa");
      return;
    }

    const row = filteredData[selectedIndex];

    setPanelMode("edit");

    setCurrentSchedule({
      id: row.id,
      name: row.routeName,
      status: row.status,
    });

    setInitialDriverId(row.driver);
    setInitialBusId(row.vehicle);

    setIsPanelOpen(true);
  };

  // ======= HANDLE DELETE ========
  const handleDelete = async () => {
    if (selectedIndex === null) {
      alert("Vui lòng chọn để xoá phân công");
      return;
    }

    const row = filteredData[selectedIndex];

    if (!window.confirm(`Gỡ phân công của "${row.routeName}"?`)) return;

    try {
      setLoading(true);
      await deleteAssignment(row.id);
      await reloadFromApi();
    } catch (err: any) {
      alert(err.message || "Lỗi khi xoá");
    } finally {
      setLoading(false);
    }
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
        onFilterClick={() => {}}
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
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${styles.row} ${
                    selectedIndex === index ? styles.rowSelected : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}
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
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: "10px", textAlign: "center" }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
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
        onClose={() => setIsPanelOpen(false)}
        onSubmit={async (p) => {
          try {
            setLoading(true);

            if (panelMode === "create") {
              await assignSchedule(p.scheduleId, p.driverId, p.busId);
            } else {
              await updateAssignment(p.scheduleId, p.driverId, p.busId);
            }

            await reloadFromApi();
            setIsPanelOpen(false);
          } catch (err: any) {
            alert(err.message);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
