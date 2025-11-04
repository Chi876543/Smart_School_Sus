import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth.module';
import { TrackingModule } from './modules/tracking.module';

// Import các schema models
import { Admin, AdminSchema } from './schema/admin.schema';
import { Stop, StopSchema } from './schema/stop.schema';
import { Route, RouteSchema } from './schema/route.schema';
import { Driver, DriverSchema } from './schema/driver.schema';
import { Bus, BusSchema } from './schema/bus.schema';
import { Student, StudentSchema } from './schema/student.schema';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { Trip, TripSchema } from './schema/trip.schema';
import { ScheduleModule } from './modules/schedule.module';
import { Timetable, TimetableSchema } from './schema/timetable.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI as string),


    // Đăng ký tất cả schema của hệ thống
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Stop.name, schema: StopSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Bus.name, schema: BusSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Trip.name, schema: TripSchema },
      { name: Timetable.name, schema: TimetableSchema },
    ]),


    ScheduleModule,
    AuthModule,
    TrackingModule,

  ],
})
export class AppModule {}
