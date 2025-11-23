"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Marker as LeafletMarker} from "leaflet";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import api from "@/services/api";
import InfoBox from "../infoBox/infoBox";
import styles from "./BusMap.module.css"
import StudentPopup from "./studentPopup";
import { io, Socket } from "socket.io-client";

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
}

// Các thông tin không thay đổi
interface BusDetailStatic {
  driverName: string;
  routeName: string;
  students: { 
    fullName: string; 
    status: string 
  }[];
}

// Các thông tin thay đổi liên tục
interface BusDetailRealtime {
  nextStop: string;
  distance: number; 
  eta: number;
}

interface BusPosition {
  lat: number;
  lng: number;
}

interface BusRoute {
  busId: string;
  polyline: [number, number][];
  stops: {
    name: string;
    lat: number;
    lng: number;
  }[]
}

export interface BusMapRef {
  selectBus: (bus: BusBasic) => void;
  flyToBus: (bus: BusBasic) => void;
  buses: BusBasic[];
  busPositions: Record<string, BusPosition>;
}

const BusMap = forwardRef<BusMapRef>((props, ref) => {
  const [buses, setBuses] = useState<BusBasic[]>([]);
  const [busDetailsStatic, setBusDetailsStatic] = useState<Record<string, BusDetailStatic>>({});
  const [busRealtime, setBusRealtime] = useState<Record<string, BusDetailRealtime>>({});
  const [selectedBus, setSelectedBus] = useState<BusBasic | null>(null);
  const [studentPopupOpen, setStudentPopupOpen] = useState(false);
  const [busRoutes, setBusRoutes] = useState<Record<string, BusRoute>>({});
  const [busPositions, setBusPositions] = useState<Record<string, BusPosition>>({})
  const [socket, setSocket] = useState<Socket | null>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const lastPositions = useRef<Record<string, [number, number]>>({}); // lưu vị trí cũ của xe để animate marker

  // Lấy busBasic cho toàn bộ xe
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
  }, []);


  // Lấy static detail cho xe
  const fetchBusDetail = async (bus: BusBasic) =>{
    if(busDetailsStatic[bus.busId]) return;

    try{
      const res = await api.get(`/tracking/schedule/${bus.scheduleId}`);
      const { driverName, routeName, stops, students } = res.data;
      setBusDetailsStatic((prev) => ({
        ...prev,
        [bus.busId]: { driverName, routeName, stops, students },
      }));
    }catch(err){
      console.error(`Error fetching details for bus ${bus.plateNumber}:`, err);
      setBusDetailsStatic((prev) => ({
        ...prev,
        [bus.busId]: {
          driverName: "Unknown",
          routeName: "Unknown",
          stops: [],
          students: []
        },
      }));
    }
  }

  // Animation cho marker mượt hơn
  function animateMarker(
    marker: LeafletMarker,
    from: [number, number],
    to: [number, number],
    duration: number = 1000
  ) {
    const start = performance.now();

    function frame(time:number) {
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;

      const lat = from[0] + (to[0] - from[0]) * progress;
      const lng = from[1] + (to[1] - from[1]) * progress;

      marker.setLatLng([lat, lng]);

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // Lấy route của các xe
  useEffect(() => {
    const socketIo = io("http://localhost:8080");
    setSocket(socketIo);

    socketIo.on('busRoute', (data: BusRoute) => {
      setBusRoutes((prev) => ({
        ...prev,
        [data.busId]: data
      }));
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Lấy realtime Detail và tọa độ của xe buýt
  useEffect(() =>{
    if(!socket) return;

    socket.on('busDetail', (data: { busId: string; detail: BusDetailRealtime & { lat: number; lng: number } }) => {
      setBusRealtime(prev => ({
        ...prev,
        [data.busId]: data.detail
      }));

      // Update bus marker
      setBusPositions(prev => ({
        ...prev,
        [data.busId]: { lat: data.detail.lat, lng: data.detail.lng }
      }));
    });

    return () => {
      socket.off('busDetail');
    };
  }, [socket])
  

  //center của map
  const center: [number, number] =
    buses.length > 0 && busPositions[buses[0].busId]
    ? [busPositions[buses[0].busId].lat, busPositions[buses[0].busId].lng] 
    : [10.762622, 106.660172];

  useImperativeHandle(ref, () => ({
    selectBus: (bus: BusBasic) => {
      setSelectedBus(bus);
      fetchBusDetail(bus);
      const pos = busPositions[bus.busId];
      if (mapRef.current) {
        if(pos)
          mapRef.current.flyTo([pos.lat, pos.lng], 15);
      }
      markerRefs.current[bus.busId]?.openTooltip();
    },
    flyToBus: (bus: BusBasic) => {
      const pos = busPositions[bus.busId];
      if (mapRef.current) {
        if (pos)
          mapRef.current.flyTo([pos.lat, pos.lng], 15);
      }
    },
    buses,
    busPositions
  }));


  return (
    <div style={{ height: "80vh", width: "100%", borderRadius: "1rem", position: "relative" }}>
      {/* Bảng thông tin chi tiết, hiển thị khi chọn marker */}
      {selectedBus && busDetailsStatic[selectedBus.busId] && (
        <InfoBox
          title="Thông tin"
          position={{ top: "10px", right: "10px" }}
          fields={[
            { label: "Xe", value: selectedBus.plateNumber },
            { label: "Tài xế", value: busDetailsStatic[selectedBus.busId].driverName },
            { label: "Tuyến", value: busDetailsStatic[selectedBus.busId].routeName },
            {
              label: "Trạm kế tiếp",
              value: busRealtime[selectedBus.busId] && busRealtime[selectedBus.busId].distance !== -1 // nếu có lỗi ở backend --> Đang tính
              ? `${busRealtime[selectedBus.busId].nextStop} (${(busRealtime[selectedBus.busId].distance/1000).toFixed(2)} km)`
              : "Đang tính...",
            },
            {
              label: "Thời gian dự kiến",
              value: busRealtime[selectedBus.busId] && busRealtime[selectedBus.busId].eta !== -1 // nếu có lỗi ở backend --> Đang tính
              ? (busRealtime[selectedBus.busId].eta < 60 
                ? `${busRealtime[selectedBus.busId].eta} giây`
                : `${Math.ceil(busRealtime[selectedBus.busId].eta / 60)} phút`)
              : "Đang tính...",
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

      {/* Bảng danh sách học sinh, hiển thị khi bấm 'Danh sách học sinh' trong InfoBox */}
      {selectedBus && busDetailsStatic[selectedBus.busId] && (
        <StudentPopup
          open={studentPopupOpen}
          onClose={() => setStudentPopupOpen(false)}
          students={busDetailsStatic[selectedBus.busId].students}
        />
      )}

      {/* Map */}
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false} ref={mapRef}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {/* Hiển thị tuyến đường cho xe được chọn */}
        {selectedBus && busRoutes[selectedBus.busId]?.polyline?.length > 0 && (
          <Polyline
            positions={busRoutes[selectedBus.busId].polyline}
            pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
          />
        )}

        {/* Hiển thị marker của các trạm dừng cho xe được chọn */}
        {selectedBus && busRoutes[selectedBus.busId]?.stops?.map((stop, idx) => (
          <Marker
            key={idx}
            position={[stop.lat, stop.lng]}
            icon={new L.Icon({
              iconUrl: "/pointer-pin.svg", // icon cho stop
              iconSize: [25, 25],
              iconAnchor: [12, 25],
              popupAnchor: [0, -25],
            })}
          >
            <Popup>
              <div>
                <strong>{stop.name}</strong>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -15]}>
              {stop.name}
            </Tooltip>
          </Marker>
        ))}

        
        {buses.map((bus) => {
          const pos = busPositions[bus.busId];
          if (!pos) return null;

          return (
            // Với mọi xe đang hoạt động, hiển thị marker của chúng khi đã nhận được tọa đồ từ WebSocket 
            <Marker
              key={bus.busId}
              position={[pos.lat, pos.lng]} // initial only
              icon={busIcon}
              ref={(el) => {
                if (el) {
                  const marker = el;

                  // nếu marker đã tồn tại từ trước thì animate từ oldPos đến newPos
                  const prev = lastPositions.current[bus.busId];
                  const next: [number, number] = [pos.lat, pos.lng];

                  if (prev) {
                    animateMarker(marker, prev, next, 800);
                  } else {
                    marker.setLatLng(next); // lần đầu
                  }

                  lastPositions.current[bus.busId] = next;
                  markerRefs.current[bus.busId] = marker;
                }
              }}

              // handle event click vào busMarker
              eventHandlers={{
                click: () => {
                  setSelectedBus(bus);
                  fetchBusDetail(bus);
                  markerRefs.current[bus.busId]?.openTooltip(); // hiển thị tooltip
                },
              }}
            >
              <Tooltip direction="right" offset={[15, -10]}>
                Xe {bus.plateNumber}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
});

export default BusMap;

