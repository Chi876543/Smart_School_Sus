import { Injectable } from '@nestjs/common';
import { TrackingLocationDto } from '../dtos/tracking-location.dto';
import { TrackingDetailDto } from 'src/dtos/tracking-detail.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { BusRepository } from '../repositories/bus.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { RouteRepository } from '../repositories/route.repository';
import { TripRepository } from '../repositories/trip.repository';
import axios from 'axios';

interface OSRMRouteResponse { 
  routes: { 
    geometry: { 
      coordinates: [number, number][]; 
    };
    distance: number; 
    duration: number; 
  }[]; 
  code: string; 
  waypoints: any[]; 
}

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
    let etaSeconds = 0; //Estimate Time of Arrival
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
      stops: (stops as any[]).map((s) =>({
        name: s.name,
        lat: s.lat,
        lng: s.lng
      })),
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

  async getBuses() { 
    const schedules = await this.scheduleRepo.findActiveSchedules(); 
    const buses: any[] = []; 
    for (const s of schedules) { 
      if (!s.busId) continue; 
      const bus = await this.busRepo.findBusById(s.busId.toString()); 
      if (!bus) continue; buses.push(bus); 
    } 
    return buses; 
  }

  async getStopsFromSchedule(scheduleId: string){
    const stops = (await this.getBusDetail(scheduleId)).stops;
    return stops;
  }

  polylines: Record<string, [number, number][]> = {}; 

  async initRoutes(){ 
    const Buses = await this.getAllBusLocations(); 
    for(const bus of Buses){ 
      const busId: string = bus.busId;
      const busCoord: [number, number] = [bus.lat, bus.lng]; 
      const stops = (await this.getBusDetail(bus.scheduleId.toString())).stops; 
      console.log(`Bus ${busId} stops:`, stops); 
      if(stops.length === 0) continue;

      const coords = [busCoord, ...stops.map((s): [number, number] => [s.lat, s.lng])]; 
      const polyline = await this.getRouteFromOSRM(coords); 
      this.polylines[busId] = polyline; 
      console.log(`Bus ${busId} polyline:`, polyline.length, 'points'); 
    } 
  }

  private async getRouteFromOSRM(coords: [number, number][]): Promise<[number, number][]> { 
    const coordStr = coords.map((c) => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`; 
    const res = await axios.get<OSRMRouteResponse>(url); 
    return res.data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]); 
  }

  private getDistance(a: [number, number], b: [number, number]): number { 
    const R = 6371000; // m 
    const dLat = ((b[0] - a[0]) * Math.PI) / 180; 
    const dLng = ((b[1] - a[1]) * Math.PI) / 180; 
    const lat1 = (a[0] * Math.PI) / 180; 
    const lat2 = (b[0] * Math.PI) / 180; 
    const sinDlat = Math.sin(dLat / 2); 
    const sinDlng = Math.sin(dLng / 2); 
    const aa = sinDlat * sinDlat + sinDlng * sinDlng * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa)); 
    return R * c; 
  } 

  getPolyline(busId: string) { 
    return this.polylines[busId]; 
  }

  async getRouteInfo(busCoord: [number, number], stopCoord: [number, number]) {
    const url = `https://router.project-osrm.org/route/v1/driving/${busCoord[1]},${busCoord[0]};${stopCoord[1]},${stopCoord[0]}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return {
        distance: data.routes[0].distance, // meters
        duration: data.routes[0].duration, // seconds
      };
    }
    return { distance: 0, duration: 0 };
  }


  //mockGPS 
  async simulateBus(busId: string, callback: (data: any) => void){ 
    const Buses = await this.getAllBusLocations(); 
    const bus = Buses.find((b) => b.busId.toString() === busId) 
    if(!bus) return; 

    const stops = (await this.getBusDetail(bus.scheduleId.toString())).stops; 
    if(stops.length === 0) return; 

    const routeLine = this.polylines[busId]; 
    if(!routeLine) return; 

    let index = 0; 
    // const threshold = 50; // 50 mét coi như tới trạm
    let currentStopIndex = 0
    

    const interval = setInterval(async () =>{ 
      if (index >= routeLine.length || currentStopIndex >= stops.length) { 
        clearInterval(interval); 
        return; 
      } 
      
      const latLng = routeLine[index];
      let nextStop = stops[currentStopIndex];

      // Lấy distance + eta từ OSRM
      const { distance, duration } = await this.getRouteInfo([latLng[0], latLng[1]], [nextStop.lat, nextStop.lng]);
      if(distance <= 0 || duration <= 0) 
        currentStopIndex++;
      

      callback({ 
        busId: bus.busId, 
        lat: latLng[0], 
        lng: latLng[1], 
        nextStop: nextStop.name,
        remainingDistance: distance, 
        eta: duration,
      }); 

      index++; 
    }, 3000); 
  }
}
