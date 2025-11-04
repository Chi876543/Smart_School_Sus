import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { Bus } from '../schema/bus.schema';
import { Driver } from '../schema/driver.schema';
import { Route } from '../schema/route.schema';
import { Stop } from '../schema/stop.schema';

// src/schedules/services/xem-chi-tiet-lich-trinh.ts
import { ScheduleResponseDTO } from '../dtos/scheduleResponse.dto';
import { BusResponseDTO } from '../dtos/bus.dto';
import { DriverResponseDTO } from '../dtos/driver.dto';
import { RouteResponseDTO } from '../dtos/route.dto';
import { StopResponseDTO } from '../dtos/stop.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class XemChiTietLichTrinhService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Bus.name) private busModel: Model<Bus>,
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Stop.name) private stopModel: Model<Stop>,
  ) {}

  /**
   * Xem chi tiết lịch trình theo ID
   * @param scheduleId - ID của lịch trình
   * @returns ScheduleResponseDTO
   */
  async execute(scheduleId: string): Promise<ScheduleResponseDTO> {
    // Kiểm tra ID hợp lệ
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new BadRequestException('ID lịch trình không hợp lệ');
    }

    // Lấy schedule với populate các ref
    const schedule = await this.scheduleModel
      .findById(scheduleId)
      .populate('busId driverId routeId')
      .lean()
      .exec();

    if (!schedule) {
      throw new NotFoundException('Không tìm thấy lịch trình');
    }

    // === Xử lý Bus ===
    const busDto: BusResponseDTO = schedule.busId
      ? {
          id: (schedule.busId as any)._id.toString(),
          plateNumber:
            (schedule.busId as any).licensePlate ||
            (schedule.busId as any).plateNumber ||
            '',
          lattitude: (schedule.busId as any).latitude ?? null,
          longtitude: (schedule.busId as any).longitude ?? null,
          speed: (schedule.busId as any).speed ?? null,
          status: (schedule.busId as any).status || 'unknown',
          capacity: (schedule.busId as any).capacity || 0,
        }
      : null;

    // === Xử lý Driver ===
    const driverDto: DriverResponseDTO = schedule.driverId
      ? {
          id: (schedule.driverId as any)._id.toString(),
          name:
            (schedule.driverId as any).fullName ||
            (schedule.driverId as any).name ||
            '',
          status: (schedule.driverId as any).status || 'active',
        }
      : null;

    // === Xử lý Route + Stops có thứ tự ===
    const routeDoc = schedule.routeId as any;
    const stopsWithOrder: { stop: StopResponseDTO; order: number }[] = [];

    if (routeDoc?.stops && Array.isArray(routeDoc.stops)) {
      for (const item of routeDoc.stops) {
        const stopId = item.stopId || item.stop;
        if (!stopId) continue;

        const stopDoc = await this.stopModel.findById(stopId).lean();
        if (stopDoc) {
          stopsWithOrder.push({
            order: item.order,
            stop: {
              id: stopDoc._id.toString(),
              name: stopDoc.name,
              lat: stopDoc.lat,
              lng: stopDoc.lng,
              active: stopDoc.active ?? true,
            },
          });
        }
      }

      // Sắp xếp theo thứ tự
      stopsWithOrder.sort((a, b) => a.order - b.order);
    }

    const routeDto: RouteResponseDTO = {
      id: routeDoc._id.toString(),
      name: routeDoc.name || '',
      active: routeDoc.active ?? true,
      distance: routeDoc.distance ?? 0,
      stops: stopsWithOrder,
    };

    // === Tạo DTO cuối cùng ===
    const result = plainToInstance(ScheduleResponseDTO, {
      id: schedule._id.toString(),
      status: schedule.status,
      name: schedule.name,
      dateStart: schedule.dateStart,
      dateEnd: schedule.dateEnd,
      bus: busDto,
      driver: driverDto,
      route: routeDto,
    });

    return result;
  }
}