import { Module } from '@nestjs/common';
import { MapService } from '../services/map.service';
import { MapController } from '../controllers/map.controller';

@Module({
  imports: [],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
