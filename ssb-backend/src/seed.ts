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
  const admin = await AdminModel.create({
    username: 'admin',
    password: 'hashed_123'
  });

  // console.log('✅ Admin created:', admin.username);

  // Điểm dừng mẫu
  const [stop1, stop2, stop3, stop4, stop5, stop6, stop7, stop8, stop9, stop10, stop11, stop12, stop13, stop14, stop15, stop16, stop17, stop18] = await StopModel.create([
    // { name: 'Trường THPT Lê Lợi', lat: 13.978128, lng: 108.006235, active: true }, // 1

    // { name: 'Viết Xuân - Hùng Vương', lat: 13.974154, lng: 108.009851, active: true }, // 2
    // { name: 'Mường Thanh', lat: 13.972006, lng: 108.014527, active: true }, // 3
    // { name: 'Tiểu học Ngô Mây', lat: 13.965669, lng: 108.017095, active: true }, // 4
    // { name: 'Điểm gửi 1', lat: 13.961568, lng: 108.016567, active: true }, // 5

    
    // { name: 'Công an phường Hội Thương', lat: 13.977050, lng: 108.000304, active: true }, // 6
    // { name: 'Nhà sách Thanh Niên', lat: 13.975549, lng: 107.997221, active: true },// 7
    // { name: 'Nhà thuốc Long Châu', lat: 13.973999, lng: 107.993449, active: true }, // 8
    // { name: 'Gara Thịnh Phát', lat: 13.9693903, lng: 107.9878484, active: true },// 9
    // { name: 'Điểm gửi 2', lat: 13.966186, lng: 107.984572, active: true },// 10

    // { name: 'Chi cục Bảo Vệ Thực Vật Tỉnh Gia Lai', lat: 13.991026, lng: 108.003970, active: true },// 11
    // { name: 'Cây xăng dầu sso 82', lat: 13.9940226, lng: 108.0004001, active: true },// 12
    // { name: 'Đầu hẻm 250 Phạm Văn Đồng', lat: 14.000229, lng: 107.995781, active: true },// 13
    // { name: 'Điểm gửi 3', lat: 14.000802, lng: 107.989927, active: true },// 14


    // { name: 'Viettel Gia Lai', lat: 13.9809699, lng: 108.0093801, active: true },// 15
    // { name: 'Garage Điện tử Ô tô', lat: 13.9714443, lng: 108.0161643, active: true },// 16
    // { name: 'Lê Duẫn - Ngô Thị Nhậm', lat: 13.9712035, lng: 108.0242909, active: true },// 17
    // { name: 'Điểm gửi 4', lat: 13.9718935, lng: 108.0330364, active: true },// 18

  { name: 'Bến xe buýt Công viên 23/9 (Điểm cuối)', lat: 10.770662, lng: 106.693445, active: true }, // stop1

  //============= CÁC ĐIỂM ĐÓN DỌC TUYẾN (TPHCM) =============//
  { name: 'Ngã sáu Phù Đổng', lat: 10.771817, lng: 106.696743, active: true }, // 2
  { name: 'Nhà thờ Đức Bà', lat: 10.779786, lng: 106.699018, active: true }, // 3
  { name: 'Diamond Plaza', lat: 10.781041, lng: 106.700796, active: true }, // 4
  { name: 'Công viên Lê Văn Tám', lat: 10.786601, lng: 106.695220, active: true }, // 5

  // Quận 3
  { name: 'Vòng xoay Dân Chủ', lat: 10.779231, lng: 106.681812, active: true }, // 6
  { name: 'Hồ Con Rùa', lat: 10.782921, lng: 106.695595, active: true }, // 7
  { name: 'Nhà văn hoá Thanh Niên', lat: 10.781207, lng: 106.698424, active: true }, // 8

  // Quận 10
  { name: 'Công viên Lê Thị Riêng', lat: 10.786015, lng: 106.660175, active: true }, // 9
  { name: 'Bệnh viện Nhân dân 115', lat: 10.761940, lng: 106.667040, active: true }, // 10
  { name: 'Ngã tư 3 Tháng 2 - Nguyễn Tri Phương', lat: 10.764785, lng: 106.668840, active: true }, // 11

  // Quận 5
  { name: 'Công viên Văn Lang', lat: 10.754178, lng: 106.664507, active: true }, // 12
  { name: 'Chợ Kim Biên', lat: 10.753879, lng: 106.662123, active: true }, // 13
  { name: 'Đại học Y Dược TPHCM', lat: 10.757233, lng: 106.660252, active: true }, // 14

  // Tân Bình
  { name: 'Công viên Hoàng Văn Thụ', lat: 10.800984, lng: 106.663451, active: true }, // 15
  { name: 'Nhà thi đấu Quân khu 7', lat: 10.800527, lng: 106.666942, active: true }, // 16
  { name: 'Etown Cộng Hoà', lat: 10.801971, lng: 106.630581, active: true }, // 17
  { name: 'Aeon Mall Tân Bình (Maximark Cộng Hoà)', lat: 10.800090, lng: 106.638265, active: true }, // 18

  ]);

  // Tuyến mẫu
  const [route1, route2, route3, route4] = await RouteModel.create([
    {
      name: 'Tuyến 1',
      active: true,
      length: 5.2,
      stops: [
        { stopId: stop5._id, order: 1 },
        { stopId: stop4._id, order: 2 },
        { stopId: stop3._id, order: 3 },
        { stopId: stop2._id, order: 4 },
        { stopId: stop1._id, order: 5 },
      ],
    },
    {
      name: 'Tuyến 2',
      active: true,
      length: 4.8,
      stops: [
        { stopId: stop10._id, order: 1 },
        { stopId: stop9._id, order: 2 },
        { stopId: stop8._id, order: 3 },
        { stopId: stop7._id, order: 4 },
        { stopId: stop6._id, order: 5 },
        { stopId: stop1._id, order: 6 },
      ],
    },
    {
      name: 'Tuyến 3',
      active: true,
      length: 6.1,
      stops: [
        { stopId: stop14._id, order: 1 },
        { stopId: stop13._id, order: 2 },
        { stopId: stop12._id, order: 3 },
        { stopId: stop11._id, order: 4 },
        { stopId: stop1._id, order: 5 },
      ],
    },
    {
      name: 'Tuyến 4',
      active: true,
      length: 6.1,
      stops: [
        { stopId: stop18._id, order: 1 },
        { stopId: stop17._id, order: 2 },
        { stopId: stop16._id, order: 3 },
        { stopId: stop15._id, order: 4 },
        { stopId: stop1._id, order: 5 },
      ],
    },
  ]);

  // Tài xế mẫu
  const [driver1, driver2, driver3, driver4, driver5] = await DriverModel.create([
    { name: 'Cao Minh Thuận', status: 'available' },
    { name: 'Tô Minh Trí', status: 'available' },
    { name: 'Phạm Gia Lai', status: 'available' },
    { name: 'Nguyễn Bá Thiên', status: 'available' },
    { name: 'Nguyễn Văn Chí', status: 'available' },
  ]);

  // Xe buýt mẫu
  const [bus1, bus2, bus3, bus4, bus5] = await BusModel.create([
    {
      plateNumber: '51A-12345',
      lat: 10.776782, lng: 106.700423,
      status: 'online',
      capacity: 40,
    },
    {
      plateNumber: '52B-67890',
      lat: 10.772421, lng: 106.698142,
      status: 'online',
      capacity: 35,
    },
    {
      plateNumber: '53C-54321',
      lat: 10.792392, lng: 106.667815,
      status: 'online',
      capacity: 35,
    },
    {
      plateNumber: '54A-12345',
      lat: 10.754178, lng: 106.664507,
      status: 'online',
      capacity: 40,
    },
    {
      plateNumber: '55A-12345',
      lat: 10.784012, lng: 106.701012,
      status: 'online',
      capacity: 40,
    },
  ]);

  // Thời khóa biểu mẫu
  const timetables = [
    { dayOfWeek: 'Monday', pickupTime: '06:30', dropoffTime: '17:00' },
    { dayOfWeek: 'Monday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Tuesday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Tuesday', pickupTime: '06:30', dropoffTime: '17:00' },
    { dayOfWeek: 'Wednesday', pickupTime: '06:30', dropoffTime: '16:00' },
    { dayOfWeek: 'Thursday', pickupTime: '06:30', dropoffTime: '15:00' },
    { dayOfWeek: 'Thursday', pickupTime: '06:30', dropoffTime: '11:00' },
    { dayOfWeek: 'Friday', pickupTime: '06:30', dropoffTime: '15:00' },
    // Nếu muốn thêm ca chiều hoặc cuối tuần:
    { dayOfWeek: 'Saturday', pickupTime: '07:00', dropoffTime: '16:00' },
    // { dayOfWeek: 'Sunday', pickupTime: '08:00', dropoffTime: '12:00' },
  ];

  const createTimeTable = await TimetableModel.insertMany(timetables);

  // Học sinh mẫu
  const [stu1, stu2, stu3, stu4, stu5, stu6, stu7, stu8, stu9, stu10, stu11, stu12, stu13, stu14, stu15, stu16, stu17, stu18, stu19, stu20, stu21, stu22, stu23, stu24, stu25, stu26, stu27, stu28, stu29, stu30] = await StudentModel.create([
    { fullName: 'Trần Gia Hân', stopId: stop5._id },
    { fullName: 'Lê Minh Tuấn', stopId: stop2._id },
    { fullName: 'Nguyễn Hoàng Nam', stopId: stop3._id },
    { fullName: 'Phạm Nhật Vy', stopId: stop4._id },
    { fullName: 'Đỗ Bảo An', stopId: stop5._id },
    { fullName: 'Vũ Quang Huy', stopId: stop5._id },
    { fullName: 'Nguyễn Gia Hân', stopId: stop5._id },
    { fullName: 'Trần Minh Tuấn', stopId: stop2._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop3._id },
    { fullName: 'Đỗ Nhật Vy', stopId: stop4._id },
    { fullName: 'Vũ Bảo An', stopId: stop5._id },
    { fullName: 'Trần Quang Huy', stopId: stop5._id },
    { fullName: 'Lê Gia Hân', stopId: stop3._id },
    { fullName: 'Nguyễn Minh Tuấn', stopId: stop2._id },
    { fullName: 'Lý Hoàng Nam', stopId: stop3._id },
    { fullName: 'Vũ Nhật Vy', stopId: stop4._id },
    { fullName: 'Nguyễn Bảo An', stopId: stop5._id },
    { fullName: 'Lý Quang Huy', stopId: stop5._id },
    { fullName: 'Phùng Gia Hân', stopId: stop2._id },
    { fullName: 'Đinh Minh Tuấn', stopId: stop2._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop3._id },
    { fullName: 'Trần Thùy Vy', stopId: stop4._id },
    { fullName: 'Đỗ Bảo Đại', stopId: stop5._id },
    { fullName: 'Vũ Quang Nam', stopId: stop5._id },
    { fullName: 'Trần Gia Cát Lượng', stopId: stop4._id },
    { fullName: 'Kiều Minh Tuấn', stopId: stop2._id },
    { fullName: 'Nguyễn Nam', stopId: stop3._id },
    { fullName: 'Phạm Yến Vy', stopId: stop4._id },
    { fullName: 'Đỗ Đại Học', stopId: stop5._id },
    { fullName: 'Vũ Mai Sang', stopId: stop3._id },
  ]);

  const [stu1c, stu2c, stu3c, stu4c, stu5c, stu6c, stu7c, stu8c, stu9c, stu10c, stu11c, stu12c, stu13c, stu14c, stu15c, stu16c, stu17c, stu18c, stu19c, stu20c, stu21c, stu22c, stu23c, stu24c, stu25c, stu26c, stu27c, stu28c, stu29c, stu30c] = await StudentModel.create([
    { fullName: 'Trần Gia Hân', stopId: stop6._id },
    { fullName: 'Lê Minh Tuấn', stopId: stop6._id },
    { fullName: 'Nguyễn Hoàng Nam', stopId: stop6._id },
    { fullName: 'Phạm Nhật Vy', stopId: stop6._id },
    { fullName: 'Đỗ Bảo An', stopId: stop6._id },
    { fullName: 'Vũ Quang Huy', stopId: stop6._id },
    { fullName: 'Nguyễn Gia Hân', stopId: stop7._id },
    { fullName: 'Trần Minh Tuấn', stopId: stop7._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop7._id },
    { fullName: 'Đỗ Nhật Vy', stopId: stop7._id },
    { fullName: 'Vũ Bảo An', stopId: stop7._id },
    { fullName: 'Trần Quang Huy', stopId: stop8._id },
    { fullName: 'Lê Gia Hân', stopId: stop8._id },
    { fullName: 'Nguyễn Minh Tuấn', stopId: stop8._id },
    { fullName: 'Lý Hoàng Nam', stopId: stop8._id },
    { fullName: 'Vũ Nhật Vy', stopId: stop8._id },
    { fullName: 'Nguyễn Bảo An', stopId: stop9._id },
    { fullName: 'Lý Quang Huy', stopId: stop9._id },
    { fullName: 'Phùng Gia Hân', stopId: stop9._id },
    { fullName: 'Đinh Minh Tuấn', stopId: stop9._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop9._id },
    { fullName: 'Trần Thùy Vy', stopId: stop9._id },
    { fullName: 'Đỗ Bảo Đại', stopId: stop9._id },
    { fullName: 'Vũ Quang Nam', stopId: stop9._id },
    { fullName: 'Trần Gia Cát Lượng', stopId: stop8._id },
    { fullName: 'Kiều Minh Tuấn', stopId: stop7._id },
    { fullName: 'Nguyễn Nam', stopId: stop8._id },
    { fullName: 'Phạm Yến Vy', stopId: stop10._id },
    { fullName: 'Đỗ Đại Học', stopId: stop9._id },
    { fullName: 'Vũ Mai Sang', stopId: stop8._id },
  ]);

  const [stu1a, stu2a, stu3a, stu4a, stu5a, stu6a, stu7a, stu8a, stu9a, stu10a, stu11a, stu12a, stu13a, stu14a, stu15a, stu16a, stu17a, stu18a, stu19a, stu20a, stu21a, stu22a, stu23a, stu24a, stu25a, stu26a, stu27a, stu28a, stu29a, stu30a] = await StudentModel.create([
    { fullName: 'Trần Gia Hân', stopId: stop15._id },
    { fullName: 'Lê Minh Tuấn', stopId: stop16._id },
    { fullName: 'Nguyễn Hoàng Nam', stopId: stop17._id },
    { fullName: 'Phạm Nhật Vy', stopId: stop18._id },
    { fullName: 'Đỗ Bảo An', stopId: stop17._id },
    { fullName: 'Vũ Quang Huy', stopId: stop17._id },
    { fullName: 'Nguyễn Gia Hân', stopId: stop17._id },
    { fullName: 'Trần Minh Tuấn', stopId: stop17._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop17._id },
    { fullName: 'Đỗ Nhật Vy', stopId: stop17._id },
    { fullName: 'Vũ Bảo An', stopId: stop17._id },
    { fullName: 'Trần Quang Huy', stopId: stop16._id },
    { fullName: 'Lê Gia Hân', stopId: stop16._id },
    { fullName: 'Nguyễn Minh Tuấn', stopId: stop16._id },
    { fullName: 'Lý Hoàng Nam', stopId: stop18._id },
    { fullName: 'Vũ Nhật Vy', stopId: stop18._id },
    { fullName: 'Nguyễn Bảo An', stopId: stop16._id },
    { fullName: 'Lý Quang Huy', stopId: stop15._id },
    { fullName: 'Phùng Gia Hân', stopId: stop16._id },
    { fullName: 'Đinh Minh Tuấn', stopId: stop15._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop18._id },
    { fullName: 'Trần Thùy Vy', stopId: stop18._id },
    { fullName: 'Đỗ Bảo Đại', stopId: stop17._id },
    { fullName: 'Vũ Quang Nam', stopId: stop16._id },
    { fullName: 'Trần Gia Cát Lượng', stopId: stop15._id },
    { fullName: 'Kiều Minh Tuấn', stopId: stop15._id },
    { fullName: 'Nguyễn Nam', stopId: stop16._id },
    { fullName: 'Phạm Yến Vy', stopId: stop17._id },
    { fullName: 'Đỗ Đại Học', stopId: stop16._id },
    { fullName: 'Vũ Mai Sang', stopId: stop17._id },
  ]);

  const [stu1b, stu2b, stu3b, stu4b, stu5b, stu6b, stu7b, stu8b, stu9b, stu10b, stu11b, stu12b, stu13b, stu14b, stu15b, stu16b, stu17b, stu18b, stu19b, stu20b, stu21b, stu22b, stu23b, stu24b, stu25b, stu26b, stu27b, stu28b, stu29b, stu30b] = await StudentModel.create([
    { fullName: 'Trần Gia Hân', stopId: stop13._id },
    { fullName: 'Lê Minh Tuấn', stopId: stop12._id },
    { fullName: 'Nguyễn Hoàng Nam', stopId: stop13._id },
    { fullName: 'Phạm Nhật Vy', stopId: stop14._id },
    { fullName: 'Đỗ Bảo An', stopId: stop13._id },
    { fullName: 'Vũ Quang Huy', stopId: stop13._id },
    { fullName: 'Nguyễn Gia Hân', stopId: stop14._id },
    { fullName: 'Trần Minh Tuấn', stopId: stop12._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop13._id },
    { fullName: 'Đỗ Nhật Vy', stopId: stop14._id },
    { fullName: 'Vũ Bảo An', stopId: stop12._id },
    { fullName: 'Trần Quang Huy', stopId: stop11._id },
    { fullName: 'Lê Gia Hân', stopId: stop13._id },
    { fullName: 'Nguyễn Minh Tuấn', stopId: stop12._id },
    { fullName: 'Lý Hoàng Nam', stopId: stop13._id },
    { fullName: 'Vũ Nhật Vy', stopId: stop14._id },
    { fullName: 'Nguyễn Bảo An', stopId: stop11._id },
    { fullName: 'Lý Quang Huy', stopId: stop11._id },
    { fullName: 'Phùng Gia Hân', stopId: stop12._id },
    { fullName: 'Đinh Minh Tuấn', stopId: stop12._id },
    { fullName: 'Phạm Hoàng Nam', stopId: stop13._id },
    { fullName: 'Trần Thùy Vy', stopId: stop14._id },
    { fullName: 'Đỗ Bảo Đại', stopId: stop11._id },
    { fullName: 'Vũ Quang Nam', stopId: stop11._id },
    { fullName: 'Trần Gia Cát Lượng', stopId: stop14._id },
    { fullName: 'Kiều Minh Tuấn', stopId: stop12._id },
    { fullName: 'Nguyễn Nam', stopId: stop13._id },
    { fullName: 'Phạm Yến Vy', stopId: stop13._id },
    { fullName: 'Đỗ Đại Học', stopId: stop12._id },
    { fullName: 'Vũ Mai Sang', stopId: stop11._id },
  ]);

  const [schedule1, schedule2] = await ScheduleModel.create([
    {
      name: 'Lịch trình tuyến A',
      status: 'active',
      dateStart: new Date('2025-01-01'),
      dateEnd: new Date('2025-12-31'),
      busId: bus1._id,
      driverId: driver1._id,
      routeId: route1._id,
      timeTables: createTimeTable.map((t) => t._id)
    },
    {
      name: 'Lịch trình tuyến B',
      status: 'unassigned',
      dateStart: new Date('2025-01-01'),
      dateEnd: new Date('2025-12-31'),
      busId: null,
      driverId: null,
      routeId: route2._id,
      timeTables: createTimeTable.map((t) => t._id)
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
        { studentId: stu1._id, status: 'not_pickup' },
        { studentId: stu2._id, status: 'not_pickup' },
        { studentId: stu3._id, status: 'not_pickup' },
        { studentId: stu4._id, status: 'not_pickup' },
        { studentId: stu5._id, status: 'not_pickup' },
        { studentId: stu6._id, status: 'not_pickup' },
        { studentId: stu7._id, status: 'not_pickup' },
        { studentId: stu8._id, status: 'not_pickup' },
      ],
    },
    {
      scheduleId: schedule2._id,
      status: 'inprogress',
      date: new Date(),
      timeStart: '06:00',
      timeEnd: '15:00',
      students: [
        { studentId: stu1c._id, status: 'not_pickup' },
        { studentId: stu2c._id, status: 'not_pickup' },
        { studentId: stu3c._id, status: 'not_pickup' },
        { studentId: stu4c._id, status: 'not_pickup' },
        { studentId: stu7c._id, status: 'not_pickup' },
        { studentId: stu8c._id, status: 'pickup' },
        { studentId: stu10c._id, status: 'pickup' },
        { studentId: stu20c._id, status: 'pickup' },
      ],
    },
  ]);

  
  console.log('🎉 Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
