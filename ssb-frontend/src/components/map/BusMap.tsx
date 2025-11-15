"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import api from "@/services/api";
import InfoBox from "../infoBox/infoBox";
import styles from "./BusMap.module.css"
import StudentPopup from "./studentPopup";

const busIcon = new L.Icon({
  iconUrl: "/bus-pointer.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  className: styles.busMarker,
});

export interface BusBasic {
  scheduleId: string;
  busId: string;
  plateNumber: string;
  lat: number;
  lng: number;
}

interface BusDetail {
  driverName: string;
  routeName: string;
  nextStop: {
    name: string;
    distance: number; // meters
  };
  eta: number; // seconds

  students: {
    fullName: string;
    status: string;
  }[];
}

export interface BusMapRef {
  selectBus: (bus: BusBasic) => void;
  flyToBus: (bus: BusBasic) => void;
  buses: BusBasic[];
}

const BusMap = forwardRef<BusMapRef>((props, ref) => {
  const [buses, setBuses] = useState<BusBasic[]>([]);
  const [busDetails, setbusDetails] = useState<Record<string, BusDetail>>({}); //key: busId
  const [selectedBus, setSelectedBus] = useState<BusBasic | null>(null);
  const [studentPopupOpen, setStudentPopupOpen] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, L.Marker>>( {});


  const fetchBusData = async () => {
    try {
      const res = await api.get("/tracking/buses");
      setBuses(res.data);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  };

  useEffect(() => {
    fetchBusData();
    const interval = setInterval(fetchBusData, 3000); // cập nhật 3s/lần
    return () => clearInterval(interval);
  }, []);


  const fetchBusDetail = async (bus: BusBasic) =>{
    if(busDetails[bus.busId]) return;

    try{
      const res = await api.get(`/tracking/schedule/${bus.scheduleId}`);
      setbusDetails((prev) =>({
        ...prev,
        [bus.busId]: res.data
      }));
    }catch(err){
      console.error(`Error fetching details for bus ${bus.plateNumber}:`, err);
      setbusDetails((prev) => ({
        ...prev,
        [bus.busId]: {
          driverName: "Unknown",
          routeName: "Unknown",
          nextStop: { name: "Unknown", distance: 0 },
          eta: 0,
          students: []
        },
      }));
    }
  }

  const center: [number, number] =
    buses.length > 0 ? [buses[0].lat, buses[0].lng] : [10.762622, 106.660172];

  useImperativeHandle(ref, () => ({
    selectBus: (bus: BusBasic) => {
      setSelectedBus(bus);
      fetchBusDetail(bus);
      if (mapRef.current) mapRef.current.flyTo([bus.lat, bus.lng], 15);
      // open tooltip
      markerRefs.current[bus.busId]?.openTooltip();
    },
    flyToBus: (bus: BusBasic) => {
      mapRef.current?.flyTo([bus.lat, bus.lng], 15);
    },
    buses,
  }));


  return (
    <div style={{ height: "80vh", width: "100%", borderRadius: "1rem", position: "relative" }}>

      {selectedBus && busDetails[selectedBus.busId] && (
        <InfoBox
          title="Thông tin"
          position={{ top: "10px", right: "10px" }}
          fields={[
            { label: "Xe", value: selectedBus.plateNumber },
            { label: "Tài xế", value: busDetails[selectedBus.busId].driverName },
            { label: "Tuyến", value: busDetails[selectedBus.busId].routeName },
            {
              label: "Trạm kế tiếp",
              value: `${busDetails[selectedBus.busId].nextStop.name} (${(busDetails[selectedBus.busId].nextStop.distance/1000).toFixed(2)} km)`,
            },
            {
              label: "Thời gian dự kiến",
              value: busDetails[selectedBus.busId].eta < 60 ? busDetails[selectedBus.busId].eta.toString() + " giây" : Math.ceil(busDetails[selectedBus.busId].eta / 60).toString() + " phút",
            },
          ]}
          actions={[
            {
              label: "Danh sách học sinh",
              onClick: () => setStudentPopupOpen(true),
            },
          ]}
        />
      )}

      {selectedBus && busDetails[selectedBus.busId] && (
        <StudentPopup
          open={studentPopupOpen}
          onClose={() => setStudentPopupOpen(false)}
          students={busDetails[selectedBus.busId].students}
        />
      )}

      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false} ref={mapRef}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {buses.map((bus) => (
          <Marker
            key={bus.busId}
            position={[bus.lat, bus.lng]}
            icon={busIcon}
            eventHandlers={{
              click: () => {
                setSelectedBus(bus);
                fetchBusDetail(bus);
                markerRefs.current[bus.busId]?.openTooltip();
              },
            }}
            ref={(el) => {
              if (el) markerRefs.current[bus.busId] = el;
            }}
          >
            <Tooltip 
            direction="right" 
            offset={[15, -10]}>
              Xe {bus.plateNumber}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

export default BusMap;

