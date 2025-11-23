import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackingLocationDto } from '../dtos/tracking-location.dto';
import { TrackingDetailDto, TripStudentDto } from 'src/dtos/tracking-detail.dto';
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
    private readonly tripRepo: TripRepository,
  ) {}

  private polylines: Record<string, [number, number][]> = {}; 

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
  async getBusStaticDetail(scheduleId: string): Promise<TrackingDetailDto> {
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
    

    // Lấy danh sách học sinh
    const students = await this.tripRepo.findTripStudents(scheduleId);
    return {
      scheduleId: scheduleId,
      plateNumber: bus.plateNumber,
      driverName: driver.name,
      routeName: route.name,
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
  
  async getStopsFromSchedule(scheduleId: string){
    const schedule = await this.scheduleRepo.findScheduleById(scheduleId);
    if (!schedule) throw new Error('Không tìm thấy Schedule');

    // Lấy danh sách các điểm dừng
    const stops = await this.routeRepo.findStopsByRouteId(schedule.routeId.toString());
    if (stops.length === 0) throw new Error('Tuyến không có điểm dừng');
    return {
      stops: (stops as any[]).map((s) =>({
        name: s.name,
        lat: s.lat,
        lng: s.lng
      })),
    };
  }

  // setup route cho toàn bộ xe buýt đang hoạt động
  async initRoutes(){ 
    const Buses = await this.getAllBusLocations(); 
    for(const bus of Buses){ 
      const busId: string = bus.busId;
      const busCoord: [number, number] = [bus.lat, bus.lng]; 
      if (!busCoord[0] || !busCoord[1]) continue;

      const stops = (await this.getStopsFromSchedule(bus.scheduleId.toString())).stops;
      console.log(`Bus ${busId} stops:`, stops); 
      if(stops.length === 0) continue;

      const coords = [busCoord, ...stops.map((s): [number, number] => [s.lat, s.lng])]; 
      try{
        const polyline = await this.getRouteFromOSRM(coords); 
        if (!polyline || polyline.length === 0) {
          throw new Error("Empty polyline from OSRM");
        }
        this.polylines[busId] = polyline; 
        console.log(`Bus ${busId} polyline:`, polyline.length, 'points'); 
      }catch(err: any){
        console.error(`Failed to init polyline for bus ${busId}:`, err?.message || err);

        // FALLBACK
        const fallback = coords;
        this.polylines[busId] = fallback;

        console.warn(`Using fallback (straight-line) polyline for bus ${busId}`);
      }
    } 
  }

  getPolyline(busId: string) { 
    return this.polylines[busId]; 
  }

  async getRouteInfo(busCoord: [number, number], stopCoord: [number, number]) {
    const url = `https://router.project-osrm.org/route/v1/driving/${busCoord[1]},${busCoord[0]};${stopCoord[1]},${stopCoord[0]}?overview=false`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM returned status ${res.status}`);

      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        return {
          distance: data.routes[0].distance, // meters
          duration: data.routes[0].duration, // seconds
        };
      } else {
        console.warn("OSRM returned no routes, using fallback");
        return { distance: -1, duration: -1 }; // fallback
      }
    } catch (err: any) {
      console.error("OSRM request failed:", err?.message || err);
      return { distance: -1, duration: -1 }; // fallback
    }
  }

  //mockGPS 
  async simulateBus(busId: string, callback: (data: any) => void){ 
    const Buses = await this.getAllBusLocations(); 
    const bus = Buses.find((b) => b.busId.toString() === busId) 
    if(!bus) 
      throw new NotFoundException(`Cannot find bus of ${busId}`); 

    const stops = (await this.getStopsFromSchedule(bus.scheduleId.toString())).stops; 
    if(stops.length === 0) 
      throw new NotFoundException(`Cannot find stops of ${busId}`);
    
    const routeLine = this.polylines[busId]; 
    if(!routeLine) 
      throw new NotFoundException(`Cannot find routeLine of ${busId}`);

    let index = 0; 
    let currentStopIndex = 0;
    let isPaused = false;
    const threshold = 5; // 5m coi như tới trạm

    const interval = setInterval(async () =>{ 

      if(isPaused) return;

      if (index >= routeLine.length || currentStopIndex >= stops.length) { 
        clearInterval(interval); 
        return; 
      } 

      const currentPosition = routeLine[index];
      let nextStop = stops[currentStopIndex];
      let distance = -1;
      let duration = -1;

      try{
        const routeInfo = await this.getRouteInfo(
          [currentPosition[0], currentPosition[1]],
          [nextStop.lat, nextStop.lng]
        );
        

        distance = routeInfo.distance;
        duration = routeInfo.duration;
      }catch(err){
        console.error(`OSRM request failed for bus ${bus.busId}:`, err);
        // fallback values remain -1
      }
      
      if(distance <= threshold && distance !== -1) {
        // bus arrives at stop
        callback({ 
          busId: bus.busId, 
          lat: currentPosition[0], 
          lng: currentPosition[1], 
          nextStop: nextStop.name,
          remainingDistance: 0, 
          eta: 0,
        });

        isPaused = true;

        // Pause random từ 10–15 giây
        const pauseTime = 10000 + Math.random() * 5000;

        setTimeout(() => {
          currentStopIndex++;
          isPaused = false;
        }, pauseTime);

        return;
      }

      callback({ 
        busId: bus.busId, 
        lat: currentPosition[0], 
        lng: currentPosition[1], 
        nextStop: nextStop.name,
        remainingDistance: distance, 
        eta: duration,
      }); 

      index++; 
    }, 3000); 
  }

  private async getRouteFromOSRM(coords: [number, number][]): Promise<[number, number][]> { 
    const coordStr = coords.map((c) => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`; 
    try {
      const res = await axios.get<OSRMRouteResponse>(url); 
      if (!res.data?.routes?.[0]) {
        throw new Error("OSRM returned no routes");
      }
      return res.data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]); 
    }catch(err: any){
      console.error("OSRM routing error:", err?.message || err);
      throw new Error(`Failed to fetch OSRM route: ${err?.message}`);
    } 
  }
}
