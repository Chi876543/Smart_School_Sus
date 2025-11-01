import { connect, model } from 'mongoose';
import { Admin, AdminSchema } from './models/admin.schema';
import { Stop, StopSchema } from './models/stop.schema';
import { Route, RouteSchema } from './models/route.schema';
import { Driver, DriverSchema } from './models/driver.schema';
import { Bus, BusSchema } from './models/bus.schema';
import { Student, StudentSchema } from './models/student.schema';
import { Schedule, ScheduleSchema } from './models/schedule.schema';
import { Trip, TripSchema } from './models/trip.schema';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ssb_db');
  console.log('✅ Connected to MongoDB');

  // ⚠️ Tạo model từ schema (vì @nestjs/mongoose không export model sẵn)
  const AdminModel = model('Admin', AdminSchema);
  const StopModel = model('Stop', StopSchema);
  const RouteModel = model('Route', RouteSchema);
  const DriverModel = model('Driver', DriverSchema);
  const BusModel = model('Bus', BusSchema);
  const StudentModel = model('Student', StudentSchema);
  const ScheduleModel = model('Schedule', ScheduleSchema);
  const TripModel = model('Trip', TripSchema);

  // Xóa dữ liệu cũ
  await Promise.all([
    AdminModel.deleteMany({}),
    StopModel.deleteMany({}),
    RouteModel.deleteMany({}),
    DriverModel.deleteMany({}),
    BusModel.deleteMany({}),
    StudentModel.deleteMany({}),
    ScheduleModel.deleteMany({}),
    TripModel.deleteMany({})
  ]);

  // Thêm dữ liệu mẫu
  // const admin = await AdminModel.create({
  //   username: 'admin',
  //   password: 'hashed_123'
  // });

  // console.log('✅ Admin created:', admin.username);

  const [stopA, stopB] = await StopModel.create([
    { name: 'Stop A', lat: 10.76, lng: 106.68, active: true },
    { name: 'Stop B', lat: 10.77, lng: 106.70, active: true }
  ]);

  const route = await RouteModel.create({
    name: 'Route 01',
    active: true,
    distance: 12.5,
    stops: [
      { stopId: stopA._id, order: 1 },
      { stopId: stopB._id, order: 2 }
    ]
  });

  const driver = await DriverModel.create({ name: 'Nguyễn Văn A', status: 'active' });
  const bus = await BusModel.create({
    plateNumber: '51A-123.45',
    capacity: 40,
    status: 'offline'
  });

  const [stu1, stu2] = await StudentModel.create([
    { fullName: 'Lê Thị A', stopId: stopA._id },
    { fullName: 'Trần Văn B', stopId: stopB._id }
  ]);

  const schedule = await ScheduleModel.create({
    name: 'Lịch sáng tháng 11',
    dateStart: new Date('2025-11-01'),
    dateEnd: new Date('2025-11-30'),
    busId: bus._id,
    driverId: driver._id,
    routeId: route._id,
    status: 'active'
  });

  await TripModel.create({
    scheduleId: schedule._id,
    date: new Date('2025-11-01'),
    timeStart: '06:30',
    timeEnd: '07:15',
    status: 'planned',
    students: [
      { studentId: stu1._id, status: 'pickup' },
      { studentId: stu2._id, status: 'not_pickup' }
    ]
  });

  console.log('🎉 Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
