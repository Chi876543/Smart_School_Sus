"use client";
import React, { useEffect, useState } from "react";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function SearchBar({placeholder = "Tìm kiếm...", value = "" , onSearch, onChange, onFocus, onBlur}:SearchBarProps){
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        onSearch?.(inputValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange?.(e.target.value);
    };



    return (
        <form 
            className={styles.container}
            onSubmit={handleSubmit}
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
                    value={inputValue}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        </form>
    );
}