"use client";
import BusMap from "./BusMap";
import SearchBar from "../searchBar/searchBar";
import styles from "./TrackingSection.module.css"

export default function TrackingSection(){
    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <BusMap/>
            </div>
            <div className={styles.searchContainer}>
                <SearchBar 
                    onSearch={(v) => console.log("Search:", v)}
                />
            </div>
        </div>
    );
}