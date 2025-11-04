import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { Route } from '../schema/route.schema';
import { Student } from '../schema/student.schema';
import { Timetable } from '../schema/timetable.schema';
import { Trip } from '../schema/trip.schema';
import { CreateScheduleDTO } from '../dtos/createSchedule.dto';

@Injectable()
export class CreateScheduleService {
  constructor(
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
    @InjectModel(Route.name) private readonly routeModel: Model<Route>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Timetable.name) private readonly timetableModel: Model<Timetable>,
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
  ) {}

  async createSchedule(data: CreateScheduleDTO) {
    const { name, dateStart, dateEnd, routeId, students, timeTables } = data;

    // Kiểm tra logic ngày tháng
    if (new Date(dateStart) > new Date(dateEnd)) {
      throw new BadRequestException('dayeStart must be before dateEnd');
    }

    // Kiểm tra route hợp lệ
    const route = await this.routeModel.findById(routeId).lean();
    if (!route) throw new BadRequestException('Route non found');

    // Kiểm tra học sinh được chọn
    if (!students || students.length === 0) {
      throw new BadRequestException('Must select at least one student');
    }

    const foundStudents = await this.studentModel.find({
      _id: { $in: students.map(id => new Types.ObjectId(id)) },
    });
    if (foundStudents.length !== students.length) {
      throw new BadRequestException('Stundent non found');
    }

    // Kiểm tra TimeTable
    let timetableDocs: string[] = [];
    if (timeTables && timeTables.length > 0) {
      const found = await this.timetableModel.find({
        _id: { $in: timeTables.map(id => new Types.ObjectId(id)) },
      });
      if (found.length !== timeTables.length) {
        throw new BadRequestException('Timetable non found');
      }
      timetableDocs = found.map(t => (t._id as Types.ObjectId).toString());
    }

    // Tạo Schedule mới (chưa có bus/driver)
    const schedule = await this.scheduleModel.create({
      name,
      dateStart,
      dateEnd,
      routeId,
      status: 'unassigned',
      timetables: timetableDocs,
      students: foundStudents.map(s => s._id),
      busId: null,
      driverId: null,
    });

    // Tạo Trip tự động dựa vào timetable và ngày
    const trips: any[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let d = new Date(dateStart); d <= new Date(dateEnd); d.setDate(d.getDate() + 1)) {
        const dayName = dayNames[d.getDay()]; // ví dụ: "Monday"
        const timetable = await this.timetableModel.findOne({ dayOfWeek: dayName }).lean();
        if (!timetable) {
            continue;
        }

        trips.push({
            scheduleId: schedule._id,
            date: new Date(d),
            timeStart: timetable.pickupTime,
            timeEnd: timetable.dropoffTime,
            status: 'planned',
            students: students.map(sid => ({
            studentId: sid,
            status: 'not_pickup',
            })),
        });
    }

    if (trips.length > 0) {
    await this.tripModel.insertMany(trips);
    }

    // Trả kết quả
    return {
      message: 'Schedule created successfully',
      scheduleId: schedule._id,
      totalStudents: foundStudents.length,
      timetableCount: timetableDocs.length,
      totalTrips: trips.length,
    };

    // return 1;
  }
}
