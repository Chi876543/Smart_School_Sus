import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { TrackingController } from '../controllers/tracking.controller';
import { TrackingService } from '../services/tracking.service';
import { BusRepository } from '../repositories/bus.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { RouteRepository } from '../repositories/route.repository';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { TripRepository } from '../repositories/trip.repository';
import { BusGateway } from 'src/busGateway';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackingController],
  providers: [TrackingService, ScheduleRepository, BusRepository, DriverRepository, RouteRepository, TripRepository, BusGateway],
  exports: [TrackingService], 
})
export class TrackingModule {}
