import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth.module';
import { MapModule } from './modules/map.module';

// Import các schema models
import { Admin, AdminSchema } from './models/admin.schema';
import { Stop, StopSchema } from './models/stop.schema';
import { Route, RouteSchema } from './models/route.schema';
import { Driver, DriverSchema } from './models/driver.schema';
import { Bus, BusSchema } from './models/bus.schema';
import { Student, StudentSchema } from './models/student.schema';
import { Schedule, ScheduleSchema } from './models/schedule.schema';
import { Trip, TripSchema } from './models/trip.schema';

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
    ]),


    
    AuthModule,

    // Module riêng của Google Maps API
    MapModule,
  ],
})
export class AppModule {}
