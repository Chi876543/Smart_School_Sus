import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateScheduleDTO } from 'src/dtos/createSchedule.dto';
import { UpdateScheduleDTO } from 'src/dtos/updateSchedule.dto';
import { Schedule } from 'src/schema';
import { ScheduleService } from 'src/services/schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('routes')
  async getAllRoutes() {
    return this.scheduleService.findAllRoute();
  }

  @Get('timetables')
  async getAllTimetables() {
    return this.scheduleService.findAllTimetable();
  }

  @Post()
  create(@Body() createDto: CreateScheduleDTO) {
    return this.scheduleService.create(createDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }
// src/controllers/schedule.controller.ts
// CHỈ THÊM 2 ROUTE MỚI

// ... [TẤT CẢ ROUTE CŨ GIỮ NGUYÊN] ...

// @Get('management')
// async findAllForManagement() {
//   return this.scheduleService.findAllForManagement();
// }

// @Get('detail/:id')
// async findOneDetail(@Param('id') id: string) {
//   return this.scheduleService.findOneDetail(id);
// }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateScheduleDTO) {
    return this.scheduleService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }


}
