import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { Bus } from '../schema/bus.schema';
import { Driver } from '../schema/driver.schema';
import { Route } from '../schema/route.schema';
import { Trip } from '../schema/trip.schema';
import { Stop } from '../schema/stop.schema';

@Injectable()
export class TrackingRepository {
  constructor(
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
    @InjectModel(Bus.name) private readonly busModel: Model<Bus>,
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    @InjectModel(Route.name) private readonly routeModel: Model<Route>,
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    @InjectModel(Stop.name) private readonly stopModel: Model<Stop>,
  ) {}

  // Lấy tất cả schedule đang hoạt động hoặc đã được lên kế hoạch
  async findActiveSchedules() {
    const now = new Date();
    return this.scheduleModel.find({
      status: { $in: ['active', 'planned'] },
      dateStart: { $lte: now },
      dateEnd: { $gte: now },
    });
  }

  // Lấy 1 schedule cụ thể
  async findScheduleById(scheduleId: string) {
    return this.scheduleModel.findById(scheduleId);
  }

  // Lấy thông tin xe buýt
  async findBusById(busId: string) {
    return this.busModel.findById(busId);
  }

  // Lấy thông tin tài xế
  async findDriverById(driverId: string) {
    return this.driverModel.findById(driverId);
  }

  // Lấy thông tin tuyến đường
  async findRouteById(routeId: string) {
    return this.routeModel.findById(routeId);
  }

  // Lấy danh sách điểm dừng (Stop) của 1 Route
  async findStopsByRouteId(routeId: string) {
    const route = await this.routeModel.findById(routeId).lean();
    if (!route?.stops?.length) return [];

    const stopIds = route.stops.map((s: any) => s.stopId);
    const stops = await this.stopModel.find({ _id: { $in: stopIds } }).lean();

    // sắp xếp đúng thứ tự order
    return route.stops
      .map((s: any) => stops.find((st: any) => st._id.toString() === s.stopId.toString()))
      .filter(Boolean);
  }

  // Lấy danh sách học sinh của trip thuộc schedule
  async findTripStudents(scheduleId: string) {
    const trip = await this.tripModel
      .findOne({ scheduleId: new Types.ObjectId(scheduleId) })
      .populate('students.studentId')
      .lean();
    if (!trip || !trip.students) return [];
    return trip.students.map((s: any) => ({
      fullName: s.studentId?.fullName ?? 'Không rõ',
      status: s.status,
    }));
  }

  // Cập nhật vị trí xe buýt
  async updateBusLocation(busId: string, lat: number, lng: number, speed?: number) {
    return this.busModel.findByIdAndUpdate(
      busId,
      { lat, lng, speed, status: 'online' },
      { new: true },
    );
  }
}
