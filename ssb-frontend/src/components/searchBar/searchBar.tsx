"use client";
import React, { useState } from "react";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({placeholder = "Tìm kiếm...", onSearch}:SearchBarProps){
    const [value, setValue] = useState("");

    const handleSummit = (e: React.FormEvent) =>{
        e.preventDefault;
        onSearch?.(value);
    };


    return (
        <form 
            className={styles.container}
            onSubmit={handleSummit}
        >
            <div className={styles.inputWrapper}>
                <img 
                    className={styles.icon}
                    src="/search.svg" 
                    alt="" 
                />
                <input 
                    className={styles.input}
                    type="text" 
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </form>
    );
}