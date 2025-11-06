import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AssignScheduleController } from '../controllers/assignment.controller';
import { AssignScheduleService } from '../services/assignment.service';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { BusRepository } from '../repositories/bus.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AssignScheduleController],
  providers: [AssignScheduleService, ScheduleRepository, DriverRepository, BusRepository],

})
export class AssignModule {}
