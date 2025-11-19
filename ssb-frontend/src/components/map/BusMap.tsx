"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
// import "leaflet-routing-machine";
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
  lat: number;
  lng: number;
}

interface BusDetail {
  driverName: string;
  routeName: string;
  stops: {
    name: string;
    lat: number;
    lng: number;
  }[]
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
}

const BusMap = forwardRef<BusMapRef>((props, ref) => {
  const [buses, setBuses] = useState<BusBasic[]>([]);
  const [busDetails, setbusDetails] = useState<Record<string, BusDetail>>({}); //key: busId
  const [selectedBus, setSelectedBus] = useState<BusBasic | null>(null);
  const [studentPopupOpen, setStudentPopupOpen] = useState(false);
  const [busRoutes, setBusRoutes] = useState<Record<string, BusRoute>>({});
  const [busPositions, setBusPositions] = useState<Record<string, BusPosition>>({})
  const [socket, setSocket] = useState<Socket | null>(null);
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
          stops: [],
          nextStop: { name: "Unknown", distance: 0 },
          eta: 0,
          students: []
        },
      }));
    }
  }

  useEffect(() => {
    const socketIo = io("http://localhost:8080");
    setSocket(socketIo);

    socketIo.on('busRoute', (data: BusRoute) => {
      console.log("WS polyline:", data);
      setBusRoutes((prev) => ({
        ...prev,
        [data.busId]: data
      }));
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  console.log("Selected bus:", selectedBus?.busId);
  console.log("Have route:", busRoutes[selectedBus?.busId || ""]?.polyline);

  useEffect(() =>{
    if(!socket) return;

    socket.on('busDetail', (data: { busId: string; detail: BusDetail & { lat: number; lng: number } }) => {
      setbusDetails(prev => ({
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

  // useEffect(() =>{
  //   if(!selectedBus || !busDetails[selectedBus.busId] || !mapRef.current) return;
    
  //   const stops = busDetails[selectedBus.busId].stops;
  //   // Remove previous route
  //   if (routingControlRef.current && mapRef.current) {
  //     routingControlRef.current.remove();
  //     routingControlRef.current = null;
  //   }

  //   const waypoints = [
  //     [selectedBus.lat, selectedBus.lng],
  //     ...stops.map((s) => [s.lat, s.lng]),
  //   ];

  //   const control = L.Routing.control({
  //     waypoints,
  //     lineOptions: { styles: [{ color: "blue", weight: 4 }] },
  //     createMarker: (
  //       index: number,
  //       waypoint: { latLng: L.LatLng }
  //     ): L.Marker | null => {
  //       if(index === 0) return null; // skip the bus marker

  //       return L.marker(waypoint.latLng, {
  //         icon: L.icon({
  //           iconUrl: "/pointer-pin.svg",
  //           iconSize: [30, 30],
  //           iconAnchor: [15, 30],
  //         }),
  //       }).bindPopup(
  //         `Stop ${index}: ${stops[index - 1].name}`
  //       );
  //     },
  //     addWaypoints: false,
  //     routeWhileDragging: false,
  //   }).addTo(mapRef.current);

  //   routingControlRef.current = control;
  // }, [selectedBus, busDetails]);

  
  const center: [number, number] =
    buses.length > 0 ? [buses[0].lat, buses[0].lng] : [10.762622, 106.660172];

  useImperativeHandle(ref, () => ({
    selectBus: (bus: BusBasic) => {
      setSelectedBus(bus);
      fetchBusDetail(bus);
      if (mapRef.current) mapRef.current.flyTo([bus.lat, bus.lng], 15);
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
              value: 
                busDetails[selectedBus.busId].eta < 60 ?
                `${busDetails[selectedBus.busId].eta} giây` :
                `${Math.ceil(busDetails[selectedBus.busId].eta / 60)} phút`,
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

        {selectedBus && busRoutes[selectedBus.busId]?.polyline?.length > 0 && (
          <Polyline
            positions={busRoutes[selectedBus.busId].polyline}
            pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
          />
        )}

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
          const pos = busPositions[bus.busId] || { lat: bus.lat, lng: bus.lng };
          return (
            <Marker
              key={bus.busId}
              position={[pos.lat, pos.lng]}
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
          );
        }
        )}
      </MapContainer>
    </div>
  );
});

export default BusMap;

