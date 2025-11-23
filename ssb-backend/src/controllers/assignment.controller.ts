import { Controller, Patch, Param, Body, Get } from '@nestjs/common';
import { AssignScheduleService } from '../services/assignment.service';
import { AssignScheduleDTO } from '../dtos/assignScheduleDTO.dto';
import { UpdateAssignScheduleDTO } from '../dtos/updateAssignSchedule.dto';
import { patch } from 'axios';

@Controller('assign')
export class AssignScheduleController {
  constructor(private readonly assignService: AssignScheduleService) {}

  // Lấy tất cả các assignment
  @Patch()
  async getAllAssignments() {
    return this.assignService.getAllAssignments();
  }

  // Lấy tất cả tài xế
  @Patch('drivers')
  async getDrivers() {
    return this.assignService.getDrivers();
  }

  // Lấy tất cả xe buýt
  @Patch('buses')
  async getBuses() {
    return this.assignService.getBuses();
  }

  // Phân công lịch trình
  @Patch(':scheduleId')
  async assignSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: AssignScheduleDTO,
  ) {
    return this.assignService.assignSchedule(scheduleId, dto);
  }

  // Cập nhật phân công lịch trình
  @Patch(':scheduleId/update')
  async updateAssignment(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateAssignScheduleDTO,
  ) {
    return this.assignService.updateAssignment(scheduleId, dto);
  }
}
