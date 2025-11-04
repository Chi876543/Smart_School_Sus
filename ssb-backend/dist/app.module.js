"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth.module");
const tracking_module_1 = require("./modules/tracking.module");
const admin_schema_1 = require("./schema/admin.schema");
const stop_schema_1 = require("./schema/stop.schema");
const route_schema_1 = require("./schema/route.schema");
const driver_schema_1 = require("./schema/driver.schema");
const bus_schema_1 = require("./schema/bus.schema");
const student_schema_1 = require("./schema/student.schema");
const schedule_schema_1 = require("./schema/schedule.schema");
const trip_schema_1 = require("./schema/trip.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: stop_schema_1.Stop.name, schema: stop_schema_1.StopSchema },
                { name: route_schema_1.Route.name, schema: route_schema_1.RouteSchema },
                { name: driver_schema_1.Driver.name, schema: driver_schema_1.DriverSchema },
                { name: bus_schema_1.Bus.name, schema: bus_schema_1.BusSchema },
                { name: student_schema_1.Student.name, schema: student_schema_1.StudentSchema },
                { name: schedule_schema_1.Schedule.name, schema: schedule_schema_1.ScheduleSchema },
                { name: trip_schema_1.Trip.name, schema: trip_schema_1.TripSchema },
            ]),
            auth_module_1.AuthModule,
            tracking_module_1.TrackingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map