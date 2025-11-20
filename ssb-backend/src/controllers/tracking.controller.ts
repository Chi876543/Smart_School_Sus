import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TrackingService } from '../services/tracking.service';
import { TrackingLocationDto } from '../dtos/tracking-location.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // Hiển thị tất cả xe buýt đang hoạt động
  @Get('buses')
  async getAllBuses() {
    return this.trackingService.getAllBusLocations();
  }

  // Xem chi tiết 1 xe buýt (biển số, tài xế, tuyến, điểm kế tiếp, học sinh)
  @Get('schedule/:id')
  async getBusDetail(@Param('id') id: string) {
    return this.trackingService.getBusStaticDetail(id);
  }

  // Cập nhật vị trí xe buýt
  @Post('update')
  async updateBusLocation(@Body() dto: TrackingLocationDto) {
    return this.trackingService.updateBusLocation(dto);
  }
}
