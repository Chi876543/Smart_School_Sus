import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { UpdateScheduleDTO } from 'src/dtos/updateSchedule.dto';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
  ) {}

  async create(name : string, dateStart: Date, dateEnd: Date, routeId: string, timetableDocs: any[], foundStudents: any[]) {
    return this.scheduleModel.create({
      name,
      dateStart,
      dateEnd,
      routeId,
      status: 'unassigned',
      timeTables: timetableDocs,
      students: foundStudents.map((s) => s._id),
      busId: null,
      driverId: null,
    });
  }

  async findAll() {
    return this.scheduleModel
      .find()
      .populate('routeId driverId busId timeTables')
      .lean();
  }

  async findAlls() {
    return this.scheduleModel
      .find()
      .populate({
        path: 'routeId',
        select: 'name', // lấy đúng trường name
      })
      .exec();
  }

  // Lấy tất cả schedule đang hoạt động hoặc đã được lên kế hoạch
  async findActiveSchedules() {
    const now = new Date();
    return this.scheduleModel.find({
      status: { $in: ['active', 'planned'] },
      dateStart: { $lte: now },
      dateEnd: { $gte: now },
    });
  }

async findOne(scheduleId: string) {
  return this.scheduleModel
    .findById(scheduleId)
    .populate('timeTables')
    .populate({
      path: 'students',
      populate: { path: 'stopId', select: 'name' },
      select: 'fullName'
    })
    .lean();
}

  // Lấy 1 schedule cụ thể
  async findScheduleById(scheduleId: string) {
    return this.scheduleModel.findById(scheduleId);
  }

  async findById(id: string) {
    return this.scheduleModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByIdAndUpdate(id: string, updateDto: UpdateScheduleDTO){
    return this.scheduleModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async assignSchedule(scheduleId: string, driverId: string, busId: string) {
    return this.scheduleModel.findByIdAndUpdate(
      new Types.ObjectId(scheduleId),
      {
        $set: {
          driverId: new Types.ObjectId(driverId),
          busId: new Types.ObjectId(busId),
          status: 'planned',
        },
      },
      { new: true },
    );
  }

  // Hàm kiểm tra xem driver hoặc bus đang bận ở schedule khác không
  async findActiveByDriverOrBus(driverId?: string, busId?: string) {
    return this.scheduleModel
      .findOne({
        status: { $in: ['planned', 'active'] }, // chỉ kiểm tra schedule còn hiệu lực
        $or: [
          { driverId: new Types.ObjectId(driverId) },
          { busId: new Types.ObjectId(busId) },
        ],
      })
      .lean();
  }

  async updateAssignment(
    scheduleId: string,
    driverId?: string,
    busId?: string,
  ) {
    const updateData: any = {};
    if (driverId) updateData.driverId = new Types.ObjectId(driverId);
    if (busId) updateData.busId = new Types.ObjectId(busId);
    if (Object.keys(updateData).length > 0) updateData.status = 'planned';

    return this.scheduleModel
      .findByIdAndUpdate(scheduleId, { $set: updateData }, { new: true })
      .lean();
  }
}
