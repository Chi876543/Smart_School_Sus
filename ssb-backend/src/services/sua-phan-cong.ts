// src/schedules/services/sua-phan-cong.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { SuaPhanCongDTO } from '../dtos/sua-phan-cong.dto';
import { ScheduleResponseDTO } from 'src/dtos/scheduleResponse.dto';
import { BusResponseDTO } from '../dtos/bus.dto';
import { DriverResponseDTO } from '../dtos/driver.dto';
import { RouteResponseDTO } from '../dtos/route.dto';
import { plainToInstance } from 'class-transformer';
import { PopulatedSchedule } from '../types/populated-schedule.interface';

@Injectable()
export class SuaPhanCongService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  async execute(scheduleId: string, dto: SuaPhanCongDTO): Promise<ScheduleResponseDTO> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new BadRequestException('ID lịch trình không hợp lệ');
    }

    const schedule = await this.scheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException('Không tìm thấy lịch trình');
    }

    // Cập nhật
    if (dto.busId) schedule.busId = new Types.ObjectId(dto.busId);
    if (dto.driverId) schedule.driverId = new Types.ObjectId(dto.driverId);
    if (dto.routeId) schedule.routeId = new Types.ObjectId(dto.routeId);
    if (dto.timeTableIds) {
      schedule.timeTables = dto.timeTableIds.map(id => new Types.ObjectId(id));
    }

    await schedule.save();

    // Lấy lại dữ liệu đã populate
    const updated = await this.scheduleModel
      .findById(scheduleId)
      .populate('busId', 'plateNumber lat lng speed status capacity')
      .populate('driverId', 'name status')
      .populate({
        path: 'routeId',
        populate: { path: 'stops.stopId', model: 'Stop', select: 'name lat lng active' },
      })
      .lean<PopulatedSchedule>() // ← Type-safe!
      .exec();

    if (!updated) throw new NotFoundException('Không thể lấy dữ liệu sau cập nhật');

    // === Dùng interface, không cần `any` ===
    const busDto: BusResponseDTO | null = updated.busId
      ? {
          id: updated.busId._id.toString(),
          plateNumber: updated.busId.plateNumber,
          lattitude: updated.busId.lat ?? null,
          longtitude: updated.busId.lng ?? null,
          speed: updated.busId.speed ?? null,
          status: updated.busId.status,
          capacity: updated.busId.capacity,
        }
      : null;

    const driverDto: DriverResponseDTO | null = updated.driverId
      ? {
          id: updated.driverId._id.toString(),
          name: updated.driverId.name,
          status: updated.driverId.status,
        }
      : null;

    const stopsWithOrder = (updated.routeId.stops || [])
      .map(item => ({
        order: item.order,
        stop: {
          id: item.stopId._id.toString(),
          name: item.stopId.name,
          lat: item.stopId.lat,
          lng: item.stopId.lng,
          active: item.stopId.active,
        },
      }))
      .sort((a, b) => a.order - b.order);

    const routeDto: RouteResponseDTO = {
      id: updated.routeId._id.toString(),
      name: updated.routeId.name,
      active: updated.routeId.active,
      distance: updated.routeId.distance,
      stops: stopsWithOrder,
    };

    return plainToInstance(ScheduleResponseDTO, {
      id: updated._id.toString(),
      status: updated.status,
      name: updated.name,
      dateStart: updated.dateStart,
      dateEnd: updated.dateEnd,
      bus: busDto,
      driver: driverDto,
      route: routeDto,
    });
  }
}