import { Controller, Post, Body } from '@nestjs/common';
import { CreateScheduleService } from '../services/createSchedule.service';

@Controller('schedule')
export class CreateScheduleController {
  constructor(private readonly createScheduleService: CreateScheduleService) {}

  @Post('create')
  async create(@Body() body: any) {
    return await this.createScheduleService.createSchedule(body);
  }
}
