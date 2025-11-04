import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleController } from "src/controllers/schedule.controller";
import { Schedule } from "src/schema";
import { ScheduleSchema } from "src/schema/schedule.schema";
import { ScheduleService } from "src/services/schedule.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Schedule.name, schema: ScheduleSchema
            }
        ])
    ],
    controllers: [ScheduleController],
    providers: [ScheduleService]
})

export class ScheduleModule {}