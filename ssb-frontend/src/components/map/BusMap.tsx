"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import api from "@/services/api";

const busIcon = new L.Icon({
  iconUrl: "/bus-pointer.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

interface BusBasic {
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
}

export default function BusMap() {
  const [buses, setBuses] = useState<BusBasic[]>([]);
  const [busDetails, setbusDetails] = useState<Record<string, BusDetail>>({}); //key: busId


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
        },
      }));
    }
  }

  const center: [number, number] =
    buses.length > 0 ? [buses[0].lat, buses[0].lng] : [10.762622, 106.660172];


  return (
    <div style={{ height: "80vh", width: "100%", borderRadius: "1rem" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {buses.map((bus) => {
          const detail = busDetails[bus.busId];
          return (
            <Marker
              key={bus.busId}
              position={[bus.lat, bus.lng]}
              icon={busIcon}
              eventHandlers={{
                click: () => fetchBusDetail(bus), // fetch details when clicked
              }}
            >
              <Popup>
                <div>
                  <b>{bus.plateNumber}</b> <br />
                  {detail ? (
                    <>
                      Tài xế: {detail.driverName} <br />
                      Tuyến: {detail.routeName} <br />
                      Điểm kế tiếp: {detail.nextStop.name} (
                      {(detail.nextStop.distance / 1000).toFixed(2)} km) <br />
                      ETA: {Math.ceil(detail.eta / 60)} phút
                    </>
                  ) : (
                    <span>Đang tải thông tin...</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
