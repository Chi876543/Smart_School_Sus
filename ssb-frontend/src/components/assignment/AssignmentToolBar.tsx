"use client";
import React from "react";
import SearchBar from "../searchBar/searchBar";
import styles from "./AssignmentToolBar.module.css";

export interface AssignmentToolbarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onEdit?: () => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  onFilterClick?: () => void;
}

export default function AssignmentToolbar({
  searchValue = "",
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  onSearchChange,
  onEdit,
  filterStatus,
  onFilterStatusChange,
  onFilterClick,
}: AssignmentToolbarProps) {
  const [open, setOpen] = React.useState(false);
  const statuses = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chưa phân công", value: "Chưa phân công" },
    { label: "Đã phân công", value: "Đã phân công" },
    { label: "Đang hoạt động", value: "Đang hoạt động" },
    { label: "Đã hoàn thành", value: "Đã hoàn thành" },
    { label: "Tạm dừng", value: "Tạm dừng" },
  ];

  return (
    <div className={styles.toolbar}>
      {/* BÊN TRÁI: Search + Filter */}
      <div className={styles.left}>
        <div className={styles.searchArea}>
          <SearchBar
            value={searchValue}
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            onChange={onSearchChange}
          />
        </div>
        <div className={styles.filterWrapper}>
          <button
            type="button"
            className={styles.filterButton}
            onClick={() => {
              setOpen((v) => !v);
            }}
          >
            <img src="/filter.svg" className={styles.icon} />
          </button>

          {open && (
            <div className={styles.filterDropdown}>
              {statuses.map((status) => (
                <div
                  key={status.value}
                  className={`${styles.filterItem} ${
                    filterStatus === status.value
                      ? styles.filterItemSelected
                      : ""
                  }`}
                  onClick={() => {
                    onFilterStatusChange(status.value);
                    setOpen(false);
                  }}
                >
                  {status.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* BÊN PHẢI: Chỉ còn nút Sửa */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn}`}
          onClick={onEdit}
        >
          Sửa phân công
        </button>
      </div>
    </div>
  );
}
