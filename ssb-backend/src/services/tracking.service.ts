import { Injectable } from '@nestjs/common';
import { TrackingRepository } from '../repository/tracking.repository';
import { TrackingLocationDto } from '../dtos/tracking-location.dto';
import { TrackingDetailDto } from 'src/dtos/tracking-detail.dto';
import axios from 'axios';

@Injectable()
export class TrackingService {
  constructor(private readonly trackingRepo: TrackingRepository) {}

  // Lấy danh sách xe đang hoạt động (Schedule active/planned)
  async getAllBusLocations() {
    const schedules = await this.trackingRepo.findActiveSchedules();
    const results: any[] = [];

    for (const s of schedules) {
      if (!s.busId) continue;
      const bus = await this.trackingRepo.findBusById(s.busId.toString());
      if (!bus) continue;

      results.push({
        scheduleId: s._id,
        busId: bus._id,
        plateNumber: bus.plateNumber,
        lat: bus.lat,
        lng: bus.lng,
        status: bus.status,
      });
    }

    return results;
  }

  // Xem chi tiết 1 xe theo schedule
  async getBusDetail(scheduleId: string): Promise<TrackingDetailDto> {
    const schedule = await this.trackingRepo.findScheduleById(scheduleId);
    if (!schedule) throw new Error('Không tìm thấy Schedule');

    const [bus, driver, route] = await Promise.all([
      this.trackingRepo.findBusById(schedule.busId.toString()),
      this.trackingRepo.findDriverById(schedule.driverId.toString()),
      this.trackingRepo.findRouteById(schedule.routeId.toString()),
    ]);

    if (!bus || !driver || !route) {
      throw new Error('Thiếu dữ liệu (bus/driver/route)');
    }

    // Lấy danh sách các điểm dừng
    const stops = await this.trackingRepo.findStopsByRouteId(schedule.routeId.toString());
    if (stops.length === 0) throw new Error('Tuyến không có điểm dừng');

    // Hàm tính khoảng cách
    const dist = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371e3;
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Xác định điểm kế tiếp gần nhất
    let nextStop = stops[0];
    let minDist = Number.MAX_VALUE;

    for (const stop of stops) {
      if (!stop) continue;
      const d = dist(bus.lat, bus.lng, stop.lat, stop.lng);
      if (d < minDist) {
        minDist = d;
        nextStop = stop;
      }
    }

    if (!nextStop) throw new Error('Không tìm thấy điểm dừng hợp lệ');
    // Tính ETA (qua OSRM)
    const url = `https://router.project-osrm.org/route/v1/driving/${bus.lng},${bus.lat};${nextStop.lng},${nextStop.lat}?overview=false`;
    let etaSeconds = 0;
    let distanceMeters = 0;

    try {
      interface OsrmResponse {
        routes: { distance: number; duration: number }[];
        code: string;
      }

      const { data } = await axios.get<OsrmResponse>(url);
      const routeData = data.routes?.[0];
      etaSeconds = routeData?.duration ?? 0;
      distanceMeters = routeData?.distance ?? 0;
    } catch (error: any) {
      console.warn('Không lấy được ETA từ OSRM:', error.message);
    }

    // Lấy danh sách học sinh
    const students = await this.trackingRepo.findTripStudents(scheduleId);
    return {
      scheduleId: scheduleId,
      plateNumber: bus.plateNumber,
      driverName: driver.name,
      routeName: route.name,
      nextStop: {
        name: nextStop.name,
        lat: nextStop.lat,
        lng: nextStop.lng,
        distance: distanceMeters,
      },
      eta: etaSeconds,
      students,
    };
  }

  // Cập nhật vị trí xe buýt
  async updateBusLocation(dto: TrackingLocationDto) {
    const { busId, lat, lng, speed } = dto;
    const bus = await this.trackingRepo.updateBusLocation(busId, lat, lng, speed);
    if (!bus) throw new Error('Không tìm thấy xe buýt');

    return {
      message: 'Cập nhật vị trí thành công',
      busId,
      lat,
      lng,
      speed,
    };
  }
}
