import { Injectable } from '@nestjs/common';
import { TrackingLocationDto } from '../dtos/tracking-location.dto';
import { TrackingDetailDto } from 'src/dtos/tracking-detail.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { BusRepository } from '../repositories/bus.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { RouteRepository } from '../repositories/route.repository';
import { TripRepository } from '../repositories/trip.repository';
import axios from 'axios';

@Injectable()
export class TrackingService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly busRepo: BusRepository,
    private readonly driverRepo: DriverRepository,
    private readonly routeRepo: RouteRepository,
    private readonly tripRepo: TripRepository
  ) {}

  // Lấy danh sách xe đang hoạt động (Schedule active/planned)
  async getAllBusLocations() {
    const schedules = await this.scheduleRepo.findActiveSchedules();
    const results: any[] = [];

    for (const s of schedules) {
      if (!s.busId) continue;
      const bus = await this.busRepo.findBusById(s.busId.toString());
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
    const schedule = await this.scheduleRepo.findScheduleById(scheduleId);
    if (!schedule) throw new Error('Không tìm thấy Schedule');

    const [bus, driver, route] = await Promise.all([
      schedule.busId
        ? this.busRepo.findBusById(schedule.busId.toString())
        : Promise.resolve(null),
      schedule.driverId
        ? this.driverRepo.findDriverById(schedule.driverId.toString())
        : Promise.resolve(null),
      this.routeRepo.findRouteById(schedule.routeId.toString()),
    ]);

    if (!bus || !driver || !route) {
      throw new Error('Thiếu dữ liệu (bus/driver/route)');
    }

    // Lấy danh sách các điểm dừng
    const stops = await this.routeRepo.findStopsByRouteId(schedule.routeId.toString());
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
    const students = await this.tripRepo.findTripStudents(scheduleId);
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
    const bus = await this.busRepo.updateBusLocation(busId, lat, lng, speed);
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
