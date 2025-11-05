"use client";
import BusMap from "@/components/map/BusMap";

export default function TrackingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Theo dõi vị trí xe buýt</h1>
      <BusMap />
    </div>
  );
}
