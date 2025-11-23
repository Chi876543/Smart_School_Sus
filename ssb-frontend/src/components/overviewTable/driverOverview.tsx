"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import OverviewTable, { Column } from "./overviewTable";
import styles from "./overviewTable.module.css";

interface Driver {
  id: string;
  fullName: string;
  assignedRoutes: string[];
  phoneNumber?: string;
  status: "active" | "inactive";
}

export default function DriverTable() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [displayDrivers, setDisplayDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchDriversData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/drivers");
      console.log(res.data);
      const driversWithPhone: Driver[] = res.data.map((driver: Driver) => ({
        ...driver,
        phoneNumber: generatePhoneNumber(), // add fake phone number
        status: driver.status || "active", // default status
      }));
      setDrivers(driversWithPhone);
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePhoneNumber = () => {
    const prefix = "09"; // Vietnamese mobile prefix
    const number = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(8, "0");
    return prefix + number;
  };

  useEffect(() =>{
    if (fetched.current) return;
    fetched.current = true;
    fetchDriversData();
  },[]);

  useEffect(() => {
    // Tìm kiếm theo tên
    const filtered = drivers.filter((driver) =>
      driver.fullName.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayDrivers(filtered);
  }, [search, drivers]);

  const columns: Column<Driver>[] = [
    { key: "fullName", label: "Họ và tên" },
    { key: "assignedRoutes", label: "Tuyến được phân công" },
    {
      key: "status",
      label: "Trạng thái",
      render: (row: Driver) => (
        <span className={`${styles.status} ${styles.active}`}>
            Đang hoạt động
        </span>
      ),
    },
    {
      key: "action",
      label: "Chi tiết",
      render: (row: Driver) => (
        <span className={styles.action} onClick={() => setSelectedDriver(row)}>
          Xem
        </span>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="text-center p-4">Loading...</div> // Nếu đang lấy dữ liệu 
      ) : (
        <OverviewTable 
          columns={columns} 
          data={displayDrivers} 
          searchValue={search}
          onSearchChange={(value) => setSearch(value)}
        />
      )}

      {/* popup hiển thị chi tiết */}
      {selectedDriver && (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.popupHeader}>
                    <h2>Chi tiết học sinh</h2>
                    <button className={styles.closeButton} onClick={() => setSelectedDriver(null)}>
                    ×
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <p><strong>Họ và tên:</strong> {selectedDriver.fullName}</p>
                    <p><strong>Tuyến được phân công:</strong> {selectedDriver.assignedRoutes?.join(", ") || "Chưa được phân tuyến"}</p>
                    <p><strong>SĐT:</strong> {selectedDriver.phoneNumber}</p>
                    <p><strong>Trạng thái:</strong> Đang hoạt động</p>
                </div>
            </div>
        </div>
        )}
    </>
  );
}