"use client";
import BusMap, { BusMapRef, BusBasic } from "./BusMap";
import SearchBar from "../searchBar/searchBar";
import styles from "./TrackingSection.module.css"
import { useRef, useState } from "react";

export default function TrackingSection(){
    const busMapRef = useRef<BusMapRef>(null);
    const [suggestions, setSuggestions] = useState<BusBasic[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const handleFocus = () => {
        const buses = busMapRef.current?.buses || [];
        if (!searchValue.trim()) {
            setSuggestions(buses.slice(0, 5));
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        const buses = busMapRef.current?.buses || [];

        if (!value.trim()) {
        // if empty input, then show max 5 buses
            setSuggestions(buses.slice(0, 5));
        } else {
            const filtered = buses.filter((bus) =>
                bus.plateNumber.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
    };

    const handleSelect = (bus: BusBasic) => {
        busMapRef.current?.selectBus(bus);
        busMapRef.current?.flyToBus(bus);
        setSuggestions([]);
        setSearchValue("Xe " + bus.plateNumber);
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <SearchBar 
                    placeholder="Tìm xe buýt..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onSearch={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={() => {
                        setTimeout(() => setSuggestions([]), 100);
                    }}
                />
                {suggestions.length > 0 && (
                    <ul className={styles.suggestionList}>
                        {suggestions.map((bus) => (
                        <li key={bus.busId} onClick={() => handleSelect(bus)}>
                            Xe {bus.plateNumber}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className={styles.mapContainer}>
                <BusMap ref={busMapRef}/>
            </div>
        </div>
    );
}