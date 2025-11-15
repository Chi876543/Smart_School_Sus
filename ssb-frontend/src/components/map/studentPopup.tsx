"use client";

import React, { useState, useMemo } from "react";
import SearchBar from "../searchBar/searchBar";
import styles from "./studentPopup.module.css"


interface Student{
    fullName: string;
    status: string;
}

interface Props{
    open: boolean;
    onClose: () => void;
    students: Student[];
}

const STATUS_LABEL: Record<string, string> = {
  pickup: "Đã đón",
  absent: "Vắng",
  dropoff: "Đã trả",
  not_pickup: "Chưa đón",
};

export default function StudentPopup({open, onClose, students}: Props){
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
        const matchName = s.fullName.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" ? true : s.status === filter;
        return matchName && matchFilter;
        });
    }, [students, search, filter]);

    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>

                <div className={styles.header}>
                    <h3>Danh sách học sinh</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchContainer}>
                        <SearchBar
                            placeholder="Tìm kiếm học sinh..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    <select
                        className={styles.filter}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="pickup">Đã đón</option>
                        <option value="not_pickup">Chưa đón</option>
                        <option value="dropoff">Đã trả</option>
                        <option value="absent">Vắng</option>
                    </select>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Họ và tên</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((s, index) => (
                                <tr key={index}>
                                    <td>{s.fullName}</td>
                                    <td>{STATUS_LABEL[s.status]}</td>
                                </tr>
                            ))}
                            
                            {/*trường hợp studentList rỗng*/}
                            {filteredStudents.length === 0 && (
                                <tr>
                                <td colSpan={2} className={styles.emptyText}>
                                    Không có học sinh nào
                                </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}