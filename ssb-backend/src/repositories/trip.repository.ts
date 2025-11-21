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

  async findByScheduleId(scheduleId: string) {
    return this.tripModel
      .find({ scheduleId: new Types.ObjectId(scheduleId) })
      .populate({
        path: 'students.studentId',
        populate: { path: 'stopId' },
      })
      .lean();
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

  async findAll() {
    return this.tripModel.find().populate('scheduleId').lean();
  }

  async findById(id: string) {
    return this.tripModel.findById(new Types.ObjectId(id)).lean();
  }

  async findstudentInTrip(tripId: string, studentId: string) {
    return this.tripModel.findOne({
      _id: new Types.ObjectId(tripId),
      'students.studentId': new Types.ObjectId(studentId),
    });
  }

  async insertMany(trips: Partial<Trip>[]) {
    return this.tripModel.insertMany(trips);
  }

  async deleteMany(id: string) {
    return this.tripModel.deleteMany({ scheduleId: new Types.ObjectId(id) });
  }
}
