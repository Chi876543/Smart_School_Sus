import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { BusController } from "src/controllers/bus.controller";
import { BusService } from "src/services/bus.service";
import { BusRepository } from "src/repositories/bus.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { ScheduleRepository } from "src/repositories/schedule.repository";


@Module({
    imports: [DatabaseModule],
    controllers: [BusController],
    providers: [BusService, BusRepository, RouteRepository, ScheduleRepository]
})

export class BusModule{}