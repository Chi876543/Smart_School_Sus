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

  // Lấy danh sách Route hộ trợ cho việc tạo và cập nhập  lịch trình
  @Get('routes')
  async getAllRoutes() {
    return this.scheduleService.findAllRoute();
  }

  // Lấy danh sách timeTables hộ trợ cho việc tạo và cập nhập lịch trình
  @Get('timetables')
  async getAllTimetables() {
    return this.scheduleService.findAllTimetable();
  }

  // Tạo schedule mới (chưa có phân công ), trạng thái unassign
  @Post('create')
  create(@Body() createDto: CreateScheduleDTO) {
    return this.scheduleService.create(createDto);
  }

  // Lấy tất cả các Schedule để hiện thị danh sách
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // Lấy thông tin chi tiết của 1 schedule (truyền vào ScheduleId)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  // Cập nhập Schedule
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateScheduleDTO) {
    return this.scheduleService.update(id, updateDto);
  }

  // Xóa lịch trình (trạng thái cancel)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }



}
