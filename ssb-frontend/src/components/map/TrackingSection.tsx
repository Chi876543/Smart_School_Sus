"use client";
import  { BusMapRef, BusBasic } from "./BusMap";
import SearchBar from "../searchBar/searchBar";
import styles from "./TrackingSection.module.css"
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const BusMap = dynamic(() => import("./BusMap"), { ssr: false });

export default function TrackingSection(){
    const busMapRef = useRef<BusMapRef>(null);
    const [suggestions, setSuggestions] = useState<BusBasic[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const handleFocus = () => {
        // Lọc chỉ những bus đã có vị trí realtime
        const busesWithPosition = busMapRef.current?.buses.filter(
            (bus) => busMapRef.current?.busPositions?.[bus.busId]
        ) || [];

        if (!searchValue.trim()) {
            setSuggestions(busesWithPosition.slice(0, 5));
        }
    };
    
    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        const busesWithPosition = busMapRef.current?.buses.filter(
            (bus) => busMapRef.current?.busPositions?.[bus.busId]
        ) || [];

        if (!value.trim()) {
            // if empty input, then show max 5 buses
            setSuggestions(busesWithPosition.slice(0, 5));
        } else {
            const filtered = busesWithPosition.filter((bus) =>
                bus.plateNumber.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
    };

    const handleSelect = (bus: BusBasic) => {
        if (!busMapRef.current?.busPositions?.[bus.busId]) return;

        busMapRef.current?.selectBus(bus);
        busMapRef.current?.flyToBus(bus);
        setSuggestions([]);
        setSearchValue("Xe " + bus.plateNumber);
    };

    const handleSearchSubmit = () => {
        if (!searchValue.trim()) return;

        const busesWithPosition = busMapRef.current
            ? busMapRef.current.buses.filter(bus => busMapRef.current!.busPositions[bus.busId])
            : [];

        const bus = busesWithPosition.find(bus =>
            bus.plateNumber.toLowerCase() === searchValue.toLowerCase().replace(/^xe\s*/, '')
        );

        if (bus) {
            busMapRef.current?.selectBus(bus);
            busMapRef.current?.flyToBus(bus);
        }

        setSuggestions([]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <SearchBar 
                    placeholder="Tìm xe buýt..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}
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