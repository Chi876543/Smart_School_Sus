"use client";
import React, { useState } from "react";
import styles from "./LeftSidebar.module.css";

interface MenuItem{
    label: string;
    key: string;
}

interface LeftSidebarProps{
    items: MenuItem[];
    onSelect?: (key: string) => void;
}

export default function LeftSidebar({items, onSelect}: LeftSidebarProps){
    const [activeKey, setActiveKey] = useState<string>(items[0]?.key || "");

    const handleClick = (item: MenuItem) => {
        setActiveKey(item.key);
        if(onSelect) onSelect(item.key);
    };

    return (
        <div className={styles.sidebar}>
            {items.map((item) =>(
                <div
                key={item.key}
                className={`${styles.menuItem} ${activeKey === item.key ? styles.active : ""}`}
                onClick={() => handleClick(item)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}