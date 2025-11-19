import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { CreateScheduleDTO } from 'src/dtos/createSchedule.dto';
import { ScheduleResponseDTO } from 'src/dtos/scheduleResponse.dto';
import { UpdateScheduleDTO } from 'src/dtos/updateSchedule.dto';
import { ScheduleRepository } from 'src/repositories/schedule.repository';
import { RouteRepository } from 'src/repositories/route.repository';
import { StudentRepository } from 'src/repositories/student.repository';
import { TimetableRepository } from 'src/repositories/timetable.repository';
import { TripRepository } from 'src/repositories/trip.repository';
import { DriverRepository } from 'src/repositories/driver.repository';
import { BusRepository } from 'src/repositories/bus.repository';
import { Schedule } from 'src/schema/schedule.schema';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly routeRepo: RouteRepository,
    private readonly studentRepo: StudentRepository,
    private readonly timetableRepo: TimetableRepository,
    private readonly tripRepo: TripRepository,
    private readonly driverRepo: DriverRepository,
    private readonly busRepo: BusRepository,
  ) {}

  async findAllRoute() {
    return this.routeRepo.findAllRoute();
  }

  async findAllTimetable() {
    return this.timetableRepo.findAll();
  }

  async create(data: CreateScheduleDTO) {
    const { name, dateStart, dateEnd, routeId, students, timeTables } = data;

    const { foundStudents, timetableDocs } = await this.validate(
      name,
      dateStart,
      dateEnd,
      routeId,
      students,
      timeTables,
    );

    // Tạo Schedule mới (chưa có bus/driver)
    const schedule = await this.scheduleRepo.create( name, dateStart, dateEnd, routeId, timetableDocs, foundStudents );

    const trips = await this.createTrip(schedule, students);

    // Trả kết quả
    return {
      message: 'Schedule created successfully',
      scheduleId: schedule._id,
      totalStudents: foundStudents.length,
      timetableCount: timetableDocs.length,
      totalTrips: trips.length,
    };
  }

  // Lấy chi tiết lịch trình bao gồm danh sách học sinh
  async findOne(scheduleId: string) {
    const schedule = await this.scheduleRepo.findOne(scheduleId);

    if (!schedule) throw new BadRequestException('Không tìm thấy lịch trình');

    // Lấy thông tin driver/bus nếu có
    const driver = schedule.driverId
      ? await this.driverRepo.findById(String(schedule.driverId))
      : null;
    const bus = schedule.busId
      ? await this.busRepo.findById(String(schedule.busId))
      : null;

    // Lấy thông tin route
    const route = await this.routeRepo.findById(String(schedule.routeId));

    // Lấy danh sách học sinh từ Trip
    const trips = await this.tripRepo.findByScheduleId(scheduleId);

    // Gom tất cả học sinh unique theo lịch trình
    const allStudentsMap = new Map();
    for (const trip of trips) {
      for (const s of trip.students) {
        const student = s.studentId as any;
        if (student && !allStudentsMap.has(student._id.toString())) {
          allStudentsMap.set(student._id.toString(), {
            id: student._id,
            fullName: student.fullName,
            stopName: student.stopId?.name ?? null,
          });
        }
      }
    }
    const students = Array.from(allStudentsMap.values());

    return {
      scheduleId: schedule._id,
      name: schedule.name,
      status: schedule.status,
      dateStart: schedule.dateStart,
      dateEnd: schedule.dateEnd,
      routeName: route?.name ?? null,
      stops: (route?.stops as any[]).map((s) => ({
        id: s.stopId._id,
        order: s.order,
        name: s.stopId.name,
      })),
      driverName: driver?.name ?? null,
      busPlate: bus?.plateNumber ?? null,
      timeTables: (schedule.timeTables as any[]).map((t) => ({
        id: t._id,
        dayOfWeek: t.dayOfWeek,
        pickupTime: t.pickupTime,
        dropoffTime: t.dropoffTime,
      })),
      students, // danh sách học sinh lấy từ Trip
    };
  }

  async findAll(): Promise<ScheduleResponseDTO[]> {
    const schedules = await this.scheduleRepo.findAlls();

    return schedules.map((s) => {
      const route: any = s.routeId; 

      return {
        id: s.id,
        routeId: route?._id?.toString() ?? null,
        routeName: route?.name ?? null,
        status: s.status,
        name: s.name,
        dateStart: s.dateStart,
        dateEnd: s.dateEnd,
      };
    }) as ScheduleResponseDTO[];
  }


  async update(id: string, updateDto: UpdateScheduleDTO) {
    const updated = await this.scheduleRepo.findByIdAndUpdate(id, updateDto);

    if (!updated) throw new NotFoundException(`Schedule ${id} not found`);

    // Get trips from schedule
    const trips = await this.tripRepo.findByScheduleId(id);

    if (trips.length === 0)
      throw new NotFoundException(`Trips not found for schedule ${id}`);

    // Get students from trip
    const oldStudents: string[] = Array.from(
      new Set(
        trips.flatMap((trip) =>
          trip.students.map((s) => s.studentId.toString()),
        ),
      ),
    );

    if (oldStudents.length === 0)
      throw new NotFoundException(`students not found`);

    const { dateStart, dateEnd, routeId, timeTables, students } = updateDto;

    if (
      dateStart !== undefined ||
      dateEnd !== undefined ||
      routeId !== undefined ||
      (Array.isArray(timeTables) && timeTables.length > 0) ||
      (Array.isArray(students) && students.length > 0)
    ) {
      // if any is defined create new trips for the schedule

      // Delete old trips
      await this.tripRepo.deleteMany(id);

      const newTrips = await this.createTrip(updated, students ?? oldStudents);

      return {
        message: 'Schedule updated successfully',
        scheduleId: updated._id,
        totalTrips: newTrips.length,
      };
    }

    return {
      message: 'Schedule updated successfully',
      scheduleId: updated._id,
    };
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.scheduleRepo.findById(id);

    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`);

    schedule.status = 'cancelled';
  }

  async createTrip(schedule: Schedule, students: string[]): Promise<any[]> {
    // Tạo Trip tự động dựa vào timetable và ngày
    const trips: any[] = [];
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    for ( let d = new Date(schedule.dateStart); d <= new Date(schedule.dateEnd); d.setDate(d.getDate() + 1) ) {
      const dayName = dayNames[d.getDay()]; // ví dụ: "Monday"
      const timetable = await this.timetableRepo.findDayOfWeekTrips(dayName);
      if (!timetable) {
        continue;
      }

    trips.push({
      scheduleId: schedule._id,
      date: new Date(d),
      timeStart: timetable.pickupTime,
      timeEnd: timetable.dropoffTime,
      status: 'planned',
      students: students.map((sid) => ({
        studentId: sid,
        status: 'not_pickup',
       })),
    });
  }
  if (trips.length > 0) await this.tripRepo.insertMany(trips);
  return trips;
  }

  async validate(
    name: string,
    dateStart: Date,
    dateEnd: Date,
    routeId: string,
    students: string[],
    timeTables: string[],
  ) {

    // Kiểm tra tên lịch trình
    if (!name || name.trim() === '') {
      throw new BadRequestException('Schedule name is required');
    }
    // Kiểm tra logic ngày tháng
    if (new Date(dateStart) > new Date(dateEnd)) {
      throw new BadRequestException('dayeStart must be before dateEnd');
    }

    // Kiểm tra route hợp lệ
    const route = await this.routeRepo.findRouteById(routeId);
    if (!route) throw new BadRequestException('Route non found');

    // Kiểm tra học sinh được chọn
    if (!students || students.length === 0) {
      throw new BadRequestException('Must select at least one student');
    }

    const foundStudents = await this.studentRepo.findByIds(students);
    if (foundStudents.length !== students.length) {
      throw new BadRequestException('Student non found');
    }

    // Kiểm tra TimeTable
    let timetableDocs: string[] = [];
    if (timeTables && timeTables.length > 0) {
      const found = await this.timetableRepo.findByIds(timeTables);
      if (found.length !== timeTables.length) {
        throw new BadRequestException('Timetable non found');
      }
      timetableDocs = found.map((t) => (t._id as Types.ObjectId).toString());
    }
    console.log(timetableDocs);

    return {
      foundStudents,
      timetableDocs,
    };
  }

}



