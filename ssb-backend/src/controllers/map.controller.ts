import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from '../services/map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('distance')
  async getDistance(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    return this.mapService.getDistance(origin, destination);
  }

  @Get('geocode')
  async getGeocode(@Query('address') address: string) {
    return this.mapService.getGeocode(address);
  }
}
