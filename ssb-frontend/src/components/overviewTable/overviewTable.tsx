"use client";
import React from "react";
import styles from "./overviewTable.module.css";
import SearchBar from "../searchBar/searchBar";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface OverviewTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function OverviewTable<T extends { id: string }>({
  columns,
  data,
  searchValue,
  onSearchChange
}: OverviewTableProps<T>) {
  return (
    <>
      <div className={styles.headerRow}>
        <div className={styles.right}>
          <SearchBar
            value={searchValue}
            placeholder="Tìm kiếm..."
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
              <tr>
              {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
              ))}
              </tr>
          </thead>
          <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                  data.map((row) => (
                  <tr key={row.id}>
                      {columns.map((col) => (
                      <td key={col.key}>
                          {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                      ))}
                  </tr>
                  ))
              ) : (
                  <tr key="empty">
                  <td colSpan={columns.length} className="text-center p-4">
                      Không có dữ liệu
                  </td>
                  </tr>
              )}
          </tbody>
        </table>
      </div>
    </>
       
  );
}


