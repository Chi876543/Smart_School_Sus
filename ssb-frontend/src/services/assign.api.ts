// src/services/assign.api.ts
import api from "./api";

// ================= KIỂU DỮ LIỆU TỪ BACKEND ====================

export interface AssignmentRow {
  id: string;
  routeName: string;
  driver: string;
  driverId: string | null;
  vehicle: string;
  vehicleId: string | null;
  status: string;
  statusCode: string;
}

export interface DriverOption {
  id: string;
  name: string;
}

export interface BusOption {
  id: string;
  plateNumber: string;
}

// =============== HÀM MAP LẠI DATA BACKEND -> FRONTEND ===============

function mapStatus(status: string): string {
  switch (status) {
    case "completed":
      return "Đã hoàn thành";
    case "unassigned":
      return "Chưa phân công";
    case "active":
      return "Đang hoạt động";
    case "planned":
      return "Đã phân công";
    case "suspended":
      return "Tạm dừng";
    case "cancelled":
      return "Hủy bỏ";
    default:
      return status || "Không xác định";
  }
}

export function mapScheduleToRow(raw: any): AssignmentRow {
  return {
    id: raw._id, // sửa từ raw.id → raw._id nếu backend dùng _id
    routeName: raw.name,

    driver: raw.driverName?.trim() || "Chưa có tài xế",
    driverId: raw.driverId ?? null,

    vehicle: raw.plateNumber?.trim() || "Chưa có xe",
    vehicleId: raw.busId ?? null,

    statusCode: raw.status,
    status: mapStatus(raw.status),
  };
}

// ========================== GỌI API ===============================

// LẤY TẤT CẢ LỊCH TRÌNH + PHÂN CÔNG
export async function getAssignments(): Promise<AssignmentRow[]> {
  const res = await api.patch("/assign");
  return res.data.map(mapScheduleToRow);
}

// LẤY TÀI XẾ
export async function getDrivers(): Promise<DriverOption[]> {
  const res = await api.patch("/assign/drivers");
  return res.data.map((d: any) => ({
    id: d._id,
    name: d.name,
  }));
}

// LẤY XE BUÝT
export async function getBuses(): Promise<BusOption[]> {
  const res = await api.patch("/assign/buses");
  return res.data.map((b: any) => ({
    id: b._id,
    plateNumber: b.plateNumber,
  }));
}

// PHÂN CÔNG LỊCH TRÌNH
export async function assignSchedule(
  scheduleId: string,
  driverId: string,
  busId: string
) {
  return api.patch(`/assign/${scheduleId}`, { driverId, busId });
}

// CẬP NHẬT PHÂN CÔNG
export async function updateAssignment(
  scheduleId: string,
  driverId: string | null,
  busId: string | null
) {
  return api.patch(`/assign/${scheduleId}/update`, { driverId, busId });
}

// GỠ PHÂN CÔNG (nếu có)
export async function deleteAssignment(scheduleId: string) {
  return api.patch(`/assign/${scheduleId}/update`, {
    driverId: null,
    busId: null,
  });
}
