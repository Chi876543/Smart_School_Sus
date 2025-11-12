"use client";
import React from "react";
import styles from "./TopBar.module.css";

interface TopBarProps{
    username: string;
    onLogout: () => void;
}

export default function TopBar({username, onLogout}: TopBarProps){
    return (
        <div className={styles.topBar}>
            <div className={styles.leftSection}>SSB</div>
            <div className={styles.rightSection}>
                <span className={styles.username}>{username}</span>
                <button className={styles.logoutButton}>Đăng xuất</button>
            </div>
        </div>
    );
}