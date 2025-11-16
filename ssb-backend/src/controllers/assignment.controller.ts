import { Controller, Patch, Param, Body, Get } from '@nestjs/common';
import { AssignScheduleService } from '../services/assignment.service';
import { AssignScheduleDTO } from '../dtos/assignScheduleDTO.dto';
import { UpdateAssignScheduleDTO } from '../dtos/updateAssignSchedule.dto';
import { patch } from 'axios';

@Controller('assign')
export class AssignScheduleController {
  constructor(private readonly assignService: AssignScheduleService) {}

  @Patch()
  async getAllAssignments() {
    return this.assignService.getAllAssignments();
  }

  @Patch('drivers')
  async getDrivers() {
    return this.assignService.getDrivers();
  }

  @Patch('buses')
  async getBuses() {
    return this.assignService.getBuses();
  }

  @Patch(':scheduleId')
  async assignSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: AssignScheduleDTO,
  ) {
    return this.assignService.assignSchedule(scheduleId, dto);
  }

  @Patch(':scheduleId/update')
  async updateAssignment(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateAssignScheduleDTO,
  ) {
    return this.assignService.updateAssignment(scheduleId, dto);
  }
}
