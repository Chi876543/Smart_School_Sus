import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { Timetable } from '../schema/timetable.schema';
import { Bus } from '../schema/bus.schema';
import { Route } from '../schema/route.schema';
import { Student } from '../schema/student.schema';
import { TaoLichTrinhDTO } from '../dtos/tao-lich-trinh.dto';
import { ScheduleResponseDTO } from '../dtos/scheduleResponse.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TaoLichTrinhService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Timetable.name) private timetableModel: Model<Timetable>,
    @InjectModel(Bus.name) private busModel: Model<Bus>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async execute(dto: TaoLichTrinhDTO): Promise<ScheduleResponseDTO> {
    const {
      name,
      dateStart,
      dateEnd,
      busId,
      driverId,
      routeId,
      timetableIds,
      students: studentInputs,
    } = dto;

    // 1. Kiểm tra bus tồn tại + lấy capacity
    const bus = await this.busModel.findById(busId).lean();
    if (!bus) throw new NotFoundException('Không tìm thấy xe buýt');
    const capacity = bus.capacity;

    // 2. Kiểm tra route tồn tại + lấy danh sách stopId hợp lệ
    const route = await this.routeModel.findById(routeId).lean();
    if (!route) throw new NotFoundException('Không tìm thấy tuyến đường');
    const validStopIds = route.stops.map((s: any) => s.stopId.toString());

    // 3. Kiểm tra học sinh: stopId phải thuộc route
    const invalidStops = studentInputs
      .filter((s) => !validStopIds.includes(s.stopId))
      .map((s) => s.stopId);
    if (invalidStops.length > 0) {
      throw new BadRequestException(
        `Các điểm dừng không thuộc tuyến: ${invalidStops.join(', ')}`,
      );
    }

    // 4. Kiểm tra trùng học sinh
    const uniqueStudentIds = new Set(studentInputs.map((s) => s.studentId));
    if (uniqueStudentIds.size !== studentInputs.length) {
      throw new BadRequestException('Có học sinh bị trùng trong danh sách');
    }

    // 5. Kiểm tra sức chứa
    if (studentInputs.length > capacity) {
      const overload = studentInputs.length - capacity;
      throw new ConflictException(
        `Xe quá tải ${overload} học sinh. Sức chứa: ${capacity}`,
      );
    }

    // 6. Kiểm tra timetable: không trùng ngày trong tuần
    const timetables = await this.timetableModel
      .find({ _id: { $in: timetableIds } })
      .lean();

    if (timetables.length !== timetableIds.length) {
      throw new NotFoundException('Một số thời khóa biểu không tồn tại');
    }

    const dayOfWeekSet = new Set(timetables.map((t) => t.dayOfWeek));
    if (dayOfWeekSet.size !== timetables.length) {
      const duplicated = [...dayOfWeekSet].filter(
        (day) => timetables.filter((t) => t.dayOfWeek === day).length > 1,
      );
      throw new ConflictException(
        `Trùng ngày trong tuần: ${duplicated.join(', ')}`,
      );
    }

    // 7. Tạo Schedule
    const schedule = await this.scheduleModel.create({
      name,
      status: 'active',
      dateStart,
      dateEnd,
      busId: new Types.ObjectId(busId),
      driverId: new Types.ObjectId(driverId),
      routeId: new Types.ObjectId(routeId),
      timeTables: timetableIds.map((id) => new Types.ObjectId(id)),
    });

    // 8. Cập nhật stopId cho học sinh
    for (const { studentId, stopId } of studentInputs) {
      await this.studentModel.updateOne(
        { _id: studentId },
        { stopId: new Types.ObjectId(stopId) },
      );
    }

    // 9. Trả về DTO chi tiết
    return this.getScheduleDetail(schedule._id.toString());
  }

  // Dùng lại logic từ xem-chi-tiet để trả về DTO
  private async getScheduleDetail(
    scheduleId: string,
  ): Promise<ScheduleResponseDTO> {
    const schedule = await this.scheduleModel
      .findById(scheduleId)
      .populate('busId', 'plateNumber lat lng speed status capacity')
      .populate('driverId', 'name status')
      .populate({
        path: 'routeId',
        populate: {
          path: 'stops.stopId',
          model: 'Stop',
          select: 'name lat lng active',
        },
      })
      .lean()
      .exec();

    // ... (dùng logic từ xem-chi-tiet-lich-trinh.ts để map sang DTO)
    // → Có thể tách thành service riêng nếu cần
    // → Ở đây mình bỏ qua để ngắn gọn, bạn có thể copy từ file xem chi tiết
    // → Hoặc tạo `ScheduleMapperService`

    return plainToInstance(ScheduleResponseDTO, {
      // ... map tương tự
    });
  }
}
