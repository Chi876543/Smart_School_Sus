import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { ScheduleController } from "src/controllers/schedule.controller";
import { ScheduleService } from "src/services/schedule.service";
import { CreateScheduleService } from '../services/createSchedule.service';
import { CreateScheduleController } from "src/controllers/createSchedule.controller";

@Module({
    imports: [DatabaseModule],
    controllers: [ScheduleController, CreateScheduleController],
    providers: [ScheduleService, CreateScheduleService],
})

export class ScheduleModule {}