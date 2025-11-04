import { connect, model } from 'mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { Stop, StopSchema } from './schema/stop.schema';
import { Route, RouteSchema } from './schema/route.schema';
import { Driver, DriverSchema } from './schema/driver.schema';
import { Bus, BusSchema } from './schema/bus.schema';
import { Student, StudentSchema } from './schema/student.schema';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { Trip, TripSchema } from './schema/trip.schema';
import { TimetableSchema } from './schema/timetable.schema';
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
  const TimetableModel = model('Timetable', TimetableSchema);

  // Xóa dữ liệu cũ
  await Promise.all([
    AdminModel.deleteMany({}),
    StopModel.deleteMany({}),
    RouteModel.deleteMany({}),
    DriverModel.deleteMany({}),
    BusModel.deleteMany({}),
    StudentModel.deleteMany({}),
    ScheduleModel.deleteMany({}),
    TripModel.deleteMany({}),
    TimetableModel.deleteMany({})
  ]);

  // Thêm dữ liệu mẫu
  // const admin = await AdminModel.create({
  //   username: 'admin',
  //   password: 'hashed_123'
  // });

  // console.log('✅ Admin created:', admin.username);

  const [stopA, stopB, stopC, stopD, stopE, stopF] = await StopModel.create([
    { name: 'Trường Lê Văn Tám', lat: 10.775, lng: 106.695, active: true },
    { name: 'Trường Hòa Bình', lat: 10.779, lng: 106.700, active: true },
    { name: 'Trường Hoa Mai', lat: 10.783, lng: 106.705, active: true },
    { name: 'Trường Nguyễn Du', lat: 10.785, lng: 106.710, active: true },
    { name: 'Trường Hồng Bàng', lat: 10.789, lng: 106.715, active: true },
    { name: 'Trường Phan Chu Trinh', lat: 10.792, lng: 106.720, active: true },
  ]);

  const [route1, route2, route3] = await RouteModel.create([
    {
      name: 'Tuyến A',
      active: true,
      length: 5.2,
      stops: [
        { stopId: stopA._id, order: 1 },
        { stopId: stopB._id, order: 2 },
        { stopId: stopC._id, order: 3 },
      ],
    },
    {
      name: 'Tuyến B',
      active: true,
      length: 4.8,
      stops: [
        { stopId: stopC._id, order: 1 },
        { stopId: stopD._id, order: 2 },
        { stopId: stopE._id, order: 3 },
      ],
    },
    {
      name: 'Tuyến C',
      active: true,
      length: 6.1,
      stops: [
        { stopId: stopE._id, order: 1 },
        { stopId: stopF._id, order: 2 },
        { stopId: stopA._id, order: 3 },
      ],
    },
  ]);

  const [driver1, driver2, driver3] = await DriverModel.create([
    { name: 'Nguyễn Văn A', status: 'available' },
    { name: 'Trần Văn B', status: 'available' },
    { name: 'Lê Văn C', status: 'available' },
  ]);

  const [bus1, bus2, bus3] = await BusModel.create([
    {
      plateNumber: '51A-12345',
      lat: 10.776,
      lng: 106.698,
      status: 'online',
      capacity: 40,
    },
    {
      plateNumber: '51B-67890',
      lat: 10.782,
      lng: 106.703,
      status: 'online',
      capacity: 35,
    },
    {
      plateNumber: '51C-54321',
      lat: 10.771,
      lng: 106.710,
      status: 'online',
      capacity: 30,
    },
  ]);

  const [stu1, stu2, stu3, stu4, stu5, stu6] = await StudentModel.create([
    { fullName: 'Trần Gia Hân', stopId: stopA._id },
    { fullName: 'Lê Minh Tuấn', stopId: stopB._id },
    { fullName: 'Nguyễn Hoàng Nam', stopId: stopC._id },
    { fullName: 'Phạm Nhật Vy', stopId: stopD._id },
    { fullName: 'Đỗ Bảo An', stopId: stopE._id },
    { fullName: 'Vũ Quang Huy', stopId: stopF._id },
  ]);

  const [schedule1, schedule2, schedule3] = await ScheduleModel.create([
    {
      name: 'Lịch trình tuyến A',
      status: 'active',
      dateStart: new Date('2025-01-01'),
      dateEnd: new Date('2025-12-31'),
      busId: bus1._id,
      driverId: driver1._id,
      routeId: route1._id,
    },
    {
      name: 'Lịch trình tuyến B',
      status: 'active',
      dateStart: new Date('2025-01-01'),
      dateEnd: new Date('2025-12-31'),
      busId: bus2._id,
      driverId: driver2._id,
      routeId: route2._id,
    },
    {
      name: 'Lịch trình tuyến C',
      status: 'active',
      dateStart: new Date('2025-01-01'),
      dateEnd: new Date('2025-12-31'),
      busId: bus3._id,
      driverId: driver3._id,
      routeId: route3._id,
    },
  ]);

  await TripModel.create([
  {
    scheduleId: schedule1._id,
    status: 'planned',
    date: new Date(), // ✅ thêm dòng này
    timeStart: '06:00', // nếu schema có
    timeEnd: '15:00',   // nếu schema có
    students: [
      { studentId: stu1._id, status: 'pickup' },
      { studentId: stu2._id, status: 'not_pickup' },
      { studentId: stu3._id, status: 'dropoff' },
    ],
  },
  {
    scheduleId: schedule2._id,
    status: 'inprogress',
    date: new Date(),
    timeStart: '06:00',
    timeEnd: '15:00',
    students: [
      { studentId: stu3._id, status: 'pickup' },
      { studentId: stu4._id, status: 'dropoff' },
    ],
  },
  {
    scheduleId: schedule3._id,
    status: 'completed',
    date: new Date(),
    timeStart: '06:00',
    timeEnd: '15:00',
    students: [
      { studentId: stu5._id, status: 'pickup' },
      { studentId: stu6._id, status: 'dropoff' },
    ],
  },
]);

  const timetables = [
    { dayOfWeek: 'Monday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Tuesday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Wednesday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Thursday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Friday', pickupTime: '06:30', dropoffTime: '15:00' },
    // Nếu muốn thêm ca chiều hoặc cuối tuần:
    { dayOfWeek: 'Saturday', pickupTime: '07:00', dropoffTime: '16:00' },
    // { dayOfWeek: 'Sunday', pickupTime: '08:00', dropoffTime: '12:00' },
  ];

  await TimetableModel.insertMany(timetables);



  console.log('🎉 Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
