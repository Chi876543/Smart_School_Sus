import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleController } from "src/controllers/schedule.controller";
import { Schedule } from "src/schema";
import { ScheduleSchema } from "src/schema/schedule.schema";
import { Route, RouteSchema } from "src/schema/route.schema";
import { Student, StudentSchema } from "src/schema/student.schema";
import { Timetable, TimetableSchema } from "src/schema/timetable.schema";
import { ScheduleService } from "src/services/schedule.service";
import { CreateScheduleService } from '../services/createSchedule.service';
import { Driver, DriverSchema } from 'src/schema/driver.schema';
import { Bus, BusSchema } from 'src/schema/bus.schema';
import { Stop, StopSchema } from "src/schema/stop.schema";
import { CreateScheduleController } from "src/controllers/createSchedule.controller";
import { Trip, TripSchema } from "src/schema/trip.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Schedule.name, schema: ScheduleSchema },
            { name: Route.name, schema: RouteSchema },          
            { name: Student.name, schema: StudentSchema },
            { name: Timetable.name, schema: TimetableSchema },
            { name: Driver.name, schema: DriverSchema },
            { name: Bus.name, schema: BusSchema },
            { name: Stop.name, schema: StopSchema },
            { name: Trip.name, schema: TripSchema },
        ])
    ],
    controllers: [ScheduleController, CreateScheduleController],
    providers: [ScheduleService, CreateScheduleService],
})

export class ScheduleModule {}