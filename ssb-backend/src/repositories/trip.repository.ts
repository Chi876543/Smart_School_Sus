import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from '../schema/trip.schema';

@Injectable()
export class TripRepository {
  constructor(@InjectModel(Trip.name) private readonly tripModel: Model<Trip>) {}

  // async createMany(trips: Partial<Trip>[]) {
  //   return this.tripModel.insertMany(trips);
  // }

  // async findByScheduleId(scheduleId: string) {
  //   return this.tripModel
  //     .find({ scheduleId: new Types.ObjectId(scheduleId) })
  //     .populate({
  //       path: 'students.studentId',
  //       populate: { path: 'stopId' },
  //     })
  //     .lean();
  // }

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

  async findAll() {
    return this.tripModel.find().populate('scheduleId').lean();
  }

  // async update(id: string, data: Partial<Trip>) {
  //   return this.tripModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.tripModel.findByIdAndDelete(id);
  // }
}
