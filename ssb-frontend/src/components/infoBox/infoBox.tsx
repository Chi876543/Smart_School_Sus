"use client";
import React from "react";
import styles from "./infoBox.module.css"

interface infoField{
    label: string;
    value: any;
}

interface infoAction{
    label: string;
    onClick: () => void;
}

interface infoBoxProps{
    title?: string;
    fields?: infoField[];
    actions?: infoAction[];
    position?: React.CSSProperties;
}

export default function InfoBox({
    title ="Thông tin",
    fields = [],
    actions = [],
    position
}: infoBoxProps){
    return(
        <div className={styles.infoboxContainer} style={position}>
            <h3 className={styles.infoboxHeader}>{title}</h3>
            <div className={styles.infoboxContent}>
                {fields.map((item, index) =>(
                    <div key={index} className={styles.infoboxRow}>
                        <span className={styles.infoboxLabel} style={{display: "block"}}>{item.label}: </span>
                        <span className={styles.infoboxValue}>{item.value}</span>
                    </div>
                ))}
            </div>

            {actions.length > 0 &&(
                <div className={styles.infoboxActions}>
                    {actions.map((item, index) =>(
                        <button
                        key={index}
                        className={styles.infoboxActionBtn}
                        onClick={item.onClick}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}