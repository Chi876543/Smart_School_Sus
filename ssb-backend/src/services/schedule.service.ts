import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, Types } from 'mongoose';
import { CreateScheduleDTO } from "src/dtos/createSchedule.dto";
import { ScheduleResponseDTO } from "src/dtos/scheduleResponse.dto";
import { UpdateScheduleDTO } from "src/dtos/updateSchedule.dto";
import { Bus, Driver, Route, Schedule, Student, Trip } from "src/schema";
import { Timetable } from "src/schema/timetable.schema";

@Injectable()
export class ScheduleService{
    constructor(
        // @InjectModel(Schedule.name)
        // private scheduleModel: Model<Schedule>
        @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
        @InjectModel(Route.name) private readonly routeModel: Model<Route>,
        @InjectModel(Student.name) private readonly studentModel: Model<Student>,
        @InjectModel(Timetable.name) private readonly timetableModel: Model<Timetable>,
        @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
        @InjectModel(Bus.name) private readonly busModel: Model<Bus>,
    ) {}

    // async create(createDto: CreateScheduleDTO):Promise<ScheduleResponseDTO>{
    //     const schedule = new this.scheduleModel(createDto);
    //     const saved = await schedule.save();
    //     return plainToInstance(ScheduleResponseDTO, {
    //         id: saved.id.toString(),
    //         ...saved.toObject()
    //     });
    // }

    async create(data: CreateScheduleDTO) {
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
        console.log(timetableDocs);
    
        // Tạo Schedule mới (chưa có bus/driver)
        const schedule = await this.scheduleModel.create({
          name,
          dateStart,
          dateEnd,
          routeId,
          status: 'unassigned',
          timeTables: timetableDocs,
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
    
      // Lấy chi tiết lịch trình bao gồm danh sách học sinh
      async getScheduleDetail(scheduleId: string) {
        const schedule = await this.scheduleModel
          .findById(scheduleId)
          .populate('routeId')
          .populate('timeTables')
          .lean();
        
        if (!schedule) throw new BadRequestException('Không tìm thấy lịch trình');
    
        // Lấy thông tin driver/bus nếu có
        const driver = schedule.driverId
          ? await this.driverModel.findById(schedule.driverId).lean()
          : null;
        const bus = schedule.busId
          ? await this.busModel.findById(schedule.busId).lean()
          : null;
    
        // Lấy danh sách học sinh từ Trip
        const trips = await this.tripModel
          .find({ scheduleId: new Types.ObjectId(scheduleId) })
          .populate({
            path: 'students.studentId',
            populate: { path: 'stopId' },
          })
          .lean();
    
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
          routeName: (schedule.routeId as any)?.name ?? null,
          driverName: driver?.name ?? null,
          busPlate: bus?.plateNumber ?? null,
          timeTables: (schedule.timeTables as any[]).map(t => ({
            id: t._id,
            dayOfWeek: t.dayOfWeek,
            pickupTime: t.pickupTime,
            dropoffTime: t.dropoffTime,
          })),
          students, // danh sách học sinh lấy từ Trip
        };
      }

    async findAll():Promise<ScheduleResponseDTO[]>{
        const schedule = await this.scheduleModel
        .find()
        .populate('busId')
        .populate('driverId')
        .populate({
            path: 'routeId',
            populate:{
                path: 'stops.stopId',
                model: 'Stop'
            }
        })
        
        .populate('timeTables')
        .exec();

        return plainToInstance(ScheduleResponseDTO,
            schedule.map((s) => ({
                id: s.id.toString(),
                ...s.toObject()
            }))
        );
    }

    async findOne(id: String):Promise<ScheduleResponseDTO>{
        const schedule = await this.scheduleModel
        .findById(id)
        .populate('busId')
        .populate('driverId')
        .populate({
            path: 'routeId',
            populate:{
                path: 'stops.stopId',
                model: 'Stop'
            }
        })
        
        .populate('timeTables')
        .exec();
        
        if(!schedule) throw new NotFoundException(`Schedule ${id} not found`);
        return plainToInstance(ScheduleResponseDTO, {
            id: schedule.id.toString(),
            ...schedule.toObject()
        });
    }

    async update(id: String, updateDto: UpdateScheduleDTO):Promise<ScheduleResponseDTO>{
        const updated = await this.scheduleModel
        .findByIdAndUpdate(id, updateDto, {new : true})
        .exec();

        if(!updated) throw new NotFoundException(`Schedule ${id} not found`);
        return plainToInstance(ScheduleResponseDTO, {
            id: updated.id.toString(),
            ...updated.toObject()
        });
    }

    async remove(id: String):Promise<void>{
        const result = await this.scheduleModel
        .findByIdAndDelete(id)
        .exec();
        
        if (!result) throw new NotFoundException(`Schedule ${id} not found`);
    }
    
}