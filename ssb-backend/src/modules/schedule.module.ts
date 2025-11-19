import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { ScheduleController } from "src/controllers/schedule.controller";
import { ScheduleService } from "src/services/schedule.service";
import { ScheduleRepository } from "src/repositories/schedule.repository";
import { StudentRepository } from "src/repositories/student.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { TimetableRepository } from "src/repositories/timetable.repository";
import { TripRepository } from "src/repositories/trip.repository";
import { DriverRepository } from "src/repositories/driver.repository";
import { BusRepository } from "src/repositories/bus.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [ScheduleController],
    providers: [ScheduleService, ScheduleRepository, StudentRepository, DriverRepository, BusRepository, RouteRepository, TimetableRepository, TripRepository],
})

export class ScheduleModule {}