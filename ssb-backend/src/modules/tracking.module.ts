import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrackingController } from '../controllers/tracking.controller';
import { TrackingService } from '../services/tracking.service';
import { TrackingRepository } from '../repository/tracking.repository';

// 🧱 Import tất cả schema (model)
import { Bus, BusSchema } from '../schema/bus.schema';
import { Driver, DriverSchema } from '../schema/driver.schema';
import { Stop, StopSchema } from '../schema/stop.schema';
import { Route, RouteSchema } from '../schema/route.schema';
import { Schedule, ScheduleSchema } from '../schema/schedule.schema';
import { Trip, TripSchema } from '../schema/trip.schema';
import { Student, StudentSchema } from '../schema/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bus.name, schema: BusSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Stop.name, schema: StopSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Trip.name, schema: TripSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingRepository],
  exports: [TrackingService], 
})
export class TrackingModule {}
