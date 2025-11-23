"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import OverviewTable, { Column } from "./overviewTable";
import styles from "./overviewTable.module.css";

interface Route {
  id: string;
  name: string;
  stops: {
    name: string;
    order: number;
  }[]
  distance: number;
  status: "active" | "inactive";
}

export default function RouteTable() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [displayRoutes, setDisplayRoutes] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchRoutesData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/routes");
      console.log(res.data);
      const Routes: Route[] = res.data.map((route: Route) => ({
        ...route,
        distance: +(route.distance / 1000).toFixed(2),
        status: route.status || "active", // default status
      }));
      setRoutes(Routes);
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    if (fetched.current) return;
    fetched.current = true;
    fetchRoutesData();
  },[]);

  useEffect(() => {
    const filtered = routes.filter((route) =>
      route.name.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayRoutes(filtered);
  }, [search, routes]);

  const columns: Column<Route>[] = [
    { key: "name", label: "Tên tuyến đường" },
    {
        key: "distance",
        label: "Độ dài ước tính",
        render: (row: Route) => `${row.distance} km`,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row: Route) => (
        <span className={`${styles.status} ${styles.active}`}>
            Đang hoạt động
        </span>
      ),
    },
    {
      key: "action",
      label: "Chi tiết",
      render: (row: Route) => (
        <span className={styles.action} onClick={() => setSelectedRoute(row)}>
          Xem
        </span>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <OverviewTable 
          columns={columns} 
          data={displayRoutes} 
          searchValue={search}
          onSearchChange={(value) => setSearch(value)}
        />
      )}

      {selectedRoute && (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.popupHeader}>
                    <h2>Chi tiết học sinh</h2>
                    <button className={styles.closeButton} onClick={() => setSelectedRoute(null)}>
                    ×
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <p><strong>Tên tuyến đường:</strong> {selectedRoute.name}</p>
                    <p><strong>Độ dài ước tính:</strong> {selectedRoute.distance} km</p>
                    <h3 className="mt-4 mb-2 font-semibold">Các trạm trên Tuyến</h3>
                    <table className={styles.table}>
                    <thead>
                        <tr>
                        <th>Thứ tự</th>
                        <th>Trạm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRoute.stops
                        .sort((a, b) => a.order - b.order)
                        .map((stop) => (
                            <tr key={stop.order}>
                            <td className="text-center">{stop.order}</td>
                            <td>{stop.name}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                    <p><strong>Trạng thái:</strong> Đang hoạt động</p>
                </div>
            </div>
        </div>
        )}
    </>
  );
}