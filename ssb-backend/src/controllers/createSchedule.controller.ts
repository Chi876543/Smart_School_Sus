import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { CreateScheduleService } from '../services/createSchedule.service';

@Controller('schedule')
export class CreateScheduleController {
  constructor(private readonly createScheduleService: CreateScheduleService) {}

  @Post('create')
  async create(@Body() body: any) {
    return await this.createScheduleService.createSchedule(body);
  }

  @Get(':id/detail')
  async getScheduleDetail(@Param('id') id: string) {
    return this.createScheduleService.getScheduleDetail(id);
  }
}
