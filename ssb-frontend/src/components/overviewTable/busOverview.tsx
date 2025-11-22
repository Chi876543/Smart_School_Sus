"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import OverviewTable, { Column } from "./overviewTable";
import styles from "./overviewTable.module.css";

interface Bus {
  id: string;
  plateNum: string;
  capacity: number;
  assignedRoutes: string[];
  status: "active" | "inactive";
}

export default function BusTable() {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusesData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/buses");
      console.log(res.data);
      const Buses: Bus[] = res.data.map((bus: Bus) => ({
        ...bus,
        status: bus.status || "active", // default status
      }));
      setBuses(Buses);
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    fetchBusesData();
  },[]);

  const columns: Column<Bus>[] = [
    { key: "plateNum", label: "Biển số xe" },
    { key: "assignedRoutes", label: "Tuyến được phân công" },
    {
      key: "status",
      label: "Trạng thái",
      render: (row: Bus) => (
        <span className={`${styles.status} ${styles.active}`}>
            Đang hoạt động
        </span>
      ),
    },
    {
      key: "action",
      label: "Chi tiết",
      render: (row: Bus) => (
        <span className={styles.action} onClick={() => setSelectedBus(row)}>
          Xem
        </span>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <OverviewTable columns={columns} data={buses} />
      )}

      {selectedBus && (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.popupHeader}>
                    <h2>Chi tiết học sinh</h2>
                    <button className={styles.closeButton} onClick={() => setSelectedBus(null)}>
                    ×
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <p><strong>Biển số xe:</strong> {selectedBus.plateNum}</p>
                    <p><strong>Tuyến được phân công:</strong> {selectedBus.assignedRoutes?.join(", ") || "Chưa được phân tuyến"}</p>
                    <p><strong>Sức chứa:</strong> {selectedBus.capacity} người</p>
                    <p><strong>Trạng thái:</strong> Đang hoạt động</p>
                </div>
            </div>
        </div>
        )}
    </>
  );
}