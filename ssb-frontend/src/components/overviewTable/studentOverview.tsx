"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import OverviewTable, { Column } from "./overviewTable";
import styles from "./overviewTable.module.css";

interface Student {
  id: string;
  fullName: string;
  stopName: string;
  phoneNumber?: string;
  status: "active" | "inactive";
}

export default function StudentTable() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [displayStudents, setDisplayStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchStudentsData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students");
      const studentsWithPhone: Student[] = res.data.map((stu: Student) => ({
        ...stu,
        phoneNumber: generatePhoneNumber(), // add fake phone number
        status: stu.status || "active", // default status
      }));
      setStudents(studentsWithPhone);
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
    fetchStudentsData();
  },[]);

  useEffect(() => {
    // Tìm kiếm theo tên
    const filtered = students.filter((student) =>
      student.fullName.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayStudents(filtered);
  }, [search, students]);

  const columns: Column<Student>[] = [
    { key: "fullName", label: "Họ và tên" },
    { key: "stopName", label: "Địa điểm đón" },
    {
      key: "status",
      label: "Trạng thái",
      render: (row: Student) => (
        <span className={`${styles.status} ${styles.active}`}>
            Đang hoạt động
        </span>
      ),
    },
    {
      key: "action",
      label: "Chi tiết",
      render: (row: Student) => (
        <span className={styles.action} onClick={() => setSelectedStudent(row)}>
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
          data={displayStudents}
          searchValue={search}
          onSearchChange={(value) => setSearch(value)} 
        />
      )}

      {/* popup hiển thị chi tiết */}
      {selectedStudent && (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.popupHeader}>
                    <h2>Chi tiết học sinh</h2>
                    <button className={styles.closeButton} onClick={() => setSelectedStudent(null)}>
                    ×
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <p><strong>Họ và tên:</strong> {selectedStudent.fullName}</p>
                    <p><strong>Địa điểm đón:</strong> {selectedStudent.stopName}</p>
                    <p><strong>SĐT phụ huynh:</strong> {selectedStudent.phoneNumber}</p>
                    <p><strong>Trạng thái:</strong> Đang hoạt động</p>
                </div>
            </div>
        </div>
        )}
    </>
  );
}

