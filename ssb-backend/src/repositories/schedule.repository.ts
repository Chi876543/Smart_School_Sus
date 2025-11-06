import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';

@Injectable()
export class ScheduleRepository {
  constructor(@InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>) {}

  // async create(data: Partial<Schedule>) {
  //   return this.scheduleModel.create(data);
  // }

  async findAll() {
    return this.scheduleModel
      .find()
      .populate('routeId driverId busId timeTables')
      .lean();
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


   // Lấy 1 schedule cụ thể
  async findScheduleById(scheduleId: string) {
    return this.scheduleModel.findById(scheduleId);
  }

  // async update(id: string, data: Partial<Schedule>) {
  //   return this.scheduleModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.scheduleModel.findByIdAndDelete(id);
  // }

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
    return this.scheduleModel.findOne({
      status: { $in: ['planned', 'active'] }, // chỉ kiểm tra schedule còn hiệu lực
      $or: [
        { driverId: new Types.ObjectId(driverId) },
        { busId: new Types.ObjectId(busId) },
      ],
    }).lean();
  }

  async updateAssignment(scheduleId: string, driverId?: string, busId?: string) {
    const updateData: any = {};
    if (driverId) updateData.driverId = new Types.ObjectId(driverId);
    if (busId) updateData.busId = new Types.ObjectId(busId);
    if (Object.keys(updateData).length > 0) updateData.status = 'planned';

    return this.scheduleModel
      .findByIdAndUpdate(scheduleId, { $set: updateData }, { new: true })
      .lean();
  }

}
