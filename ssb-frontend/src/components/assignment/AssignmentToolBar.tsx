"use client";
import React from "react";
import SearchBar from "../searchBar/searchBar"; // chỉnh path đúng với project của bạn
import styles from "./AssignmentToolBar.module.css";

export interface AssignmentToolbarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onEdit?: () => void;
  onFilterClick?: () => void;
}

export default function AssignmentToolbar({
  searchValue = "",
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  onSearchChange,
  onEdit,
  onFilterClick,
}: AssignmentToolbarProps) {
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

        <button
          type="button"
          className={styles.iconButton}
          onClick={onFilterClick}
        >
          <img src="/filter.svg" alt="Lọc" className={styles.icon} />
        </button>
      </div>

      {/* BÊN PHẢI: Chỉ còn nút Sửa */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnEdit}`}
          onClick={onEdit}
        >
          Sửa phân công
        </button>
      </div>
    </div>
  );
}
