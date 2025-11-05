"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import api from "@/services/api";

const busIcon = new L.Icon({
  iconUrl: "/icons/bus-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function BusMap() {
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    const fetchBusData = async () => {
      const res = await api.get("/tracking");
      setBuses(res.data);
    };
    fetchBusData();
    const interval = setInterval(fetchBusData, 3000); // cập nhật 3s/lần
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={13}
      style={{ height: "80vh", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {buses.map((bus) => (
        <Marker key={bus._id} position={[bus.lat, bus.lng]} icon={busIcon}>
          <Popup>
            <div>
              <b>{bus.plateNumber}</b> <br />
              Tài xế: {bus.driverName} <br />
              Tuyến: {bus.routeName}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
