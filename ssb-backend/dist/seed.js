"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin_schema_1 = require("./models/admin.schema");
const stop_schema_1 = require("./models/stop.schema");
const route_schema_1 = require("./models/route.schema");
const driver_schema_1 = require("./models/driver.schema");
const bus_schema_1 = require("./models/bus.schema");
const student_schema_1 = require("./models/student.schema");
const schedule_schema_1 = require("./models/schedule.schema");
const trip_schema_1 = require("./models/trip.schema");
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
    const admin = await AdminModel.create({
        username: 'admin',
        password: 'hashed_123'
    });
    console.log('✅ Admin created:', admin.username);
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
//# sourceMappingURL=seed.js.map