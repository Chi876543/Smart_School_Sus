import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { ScheduleController } from "src/controllers/schedule.controller";
import { ScheduleService } from "src/services/schedule.service";

@Module({
    imports: [DatabaseModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})

export class ScheduleModule {}