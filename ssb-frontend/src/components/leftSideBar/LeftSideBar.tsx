"use client";
import React, { useState } from "react";
import styles from "./LeftSidebar.module.css";

interface MenuItem{
    label: string;
    key: string;
    children?: MenuItem[];
}

interface LeftSidebarProps{
    items: MenuItem[];
    onSelect?: (key: string) => void;
}

export default function LeftSidebar({items, onSelect}: LeftSidebarProps){
    const [activeKey, setActiveKey] = useState<string>(items[0]?.key || "");
    const [openKeys, setOpenKeys] = useState<string[]>([]); // store expanded menus

    const handleClick = (item: MenuItem) => {
        if (item.children) {
            // toggle submenu
            setOpenKeys((prev) =>
                prev.includes(item.key) ? prev.filter((k) => k !== item.key) : [...prev, item.key]
            );
            // select first child by default
            if (item.children.length > 0) {
                setActiveKey(item.children[0].key);
                onSelect?.(item.children[0].key);
            }
        } else {
            setActiveKey(item.key);
            onSelect?.(item.key);
        }
    };

    // Check if parent should be active
    const isParentActive = (item: MenuItem) => {
        if (item.key === activeKey) return true; // parent clicked directly
        if (item.children) {
        return item.children.some((child) => child.key === activeKey);
        }
        return false;
    };

    return (
        <div className={styles.sidebar}>
            {items.map((item) =>(
                <div key={item.key}>
                    <div
                        key={item.key}
                        className={`${styles.menuItem} ${isParentActive(item) ? styles.active : ""}`}
                        onClick={() => handleClick(item)}
                    >
                        {item.label}
                    </div>
                    {/* Render submenu if open */}
                    {item.children && openKeys.includes(item.key) && (
                        <div className={styles.submenu}>
                        {item.children.map((child) => (
                            <div
                            key={child.key}
                            className={`${styles.menuItem} ${activeKey === child.key ? styles.active : ""}`}
                            onClick={() => {
                                setActiveKey(child.key);
                                onSelect?.(child.key);
                            }}
                            >
                            {child.label}
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}