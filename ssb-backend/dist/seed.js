"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin_schema_1 = require("./schema/admin.schema");
const stop_schema_1 = require("./schema/stop.schema");
const route_schema_1 = require("./schema/route.schema");
const driver_schema_1 = require("./schema/driver.schema");
const bus_schema_1 = require("./schema/bus.schema");
const student_schema_1 = require("./schema/student.schema");
const schedule_schema_1 = require("./schema/schedule.schema");
const trip_schema_1 = require("./schema/trip.schema");
const timetable_schema_1 = require("./schema/timetable.schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function seed() {
    await (0, mongoose_1.connect)(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ssb_db');
    console.log('✅ Connected to MongoDB');
    const AdminModel = (0, mongoose_1.model)('Admin', admin_schema_1.AdminSchema);
    const StopModel = (0, mongoose_1.model)('Stop', stop_schema_1.StopSchema);
    const RouteModel = (0, mongoose_1.model)('Route', route_schema_1.RouteSchema);
    const DriverModel = (0, mongoose_1.model)('Driver', driver_schema_1.DriverSchema);
    const BusModel = (0, mongoose_1.model)('Bus', bus_schema_1.BusSchema);
    const StudentModel = (0, mongoose_1.model)('Student', student_schema_1.StudentSchema);
    const ScheduleModel = (0, mongoose_1.model)('Schedule', schedule_schema_1.ScheduleSchema);
    const TripModel = (0, mongoose_1.model)('Trip', trip_schema_1.TripSchema);
    const TimetableModel = (0, mongoose_1.model)('Timetable', timetable_schema_1.TimetableSchema);
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
    const timetables = [
        { dayOfWeek: 'Monday', pickupTime: '06:30', dropoffTime: '15:00' },
        { dayOfWeek: 'Tuesday', pickupTime: '06:30', dropoffTime: '15:00' },
        { dayOfWeek: 'Wednesday', pickupTime: '06:30', dropoffTime: '15:00' },
        { dayOfWeek: 'Thursday', pickupTime: '06:30', dropoffTime: '15:00' },
        { dayOfWeek: 'Friday', pickupTime: '06:30', dropoffTime: '15:00' },
        { dayOfWeek: 'Saturday', pickupTime: '07:00', dropoffTime: '16:00' },
    ];
    const createTimeTable = await TimetableModel.insertMany(timetables);
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
            timeTables: createTimeTable.map((t) => t._id)
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
            date: new Date(),
            timeStart: '06:00',
            timeEnd: '15:00',
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
    console.log('🎉 Seed completed successfully!');
    process.exit(0);
}
seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map