import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { DriverController } from "src/controllers/driver.controller";
import { DriverService } from "src/services/driver.service";
import { DriverRepository } from "src/repositories/driver.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { ScheduleRepository } from "src/repositories/schedule.repository";


@Module({
    imports: [DatabaseModule],
    controllers: [DriverController],
    providers: [DriverService, DriverRepository, RouteRepository, ScheduleRepository]
})

export class DriverModule{}