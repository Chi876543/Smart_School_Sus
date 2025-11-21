import {
  Controller,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { TripService } from '../services/trip.service';
import { UpdateTripStudentStatusDTO } from '../dtos/updateTripStudentStatus.dto';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  /**
   * Update student status inside a trip
   * PATCH /trips/:tripId/students/:studentId/status
   */
  @Patch('/:tripId/students/:studentId/status')
  async updateStudentStatus(
    @Param('tripId') tripId: string,
    @Param('studentId') studentId: string,
    @Body() dto: UpdateTripStudentStatusDTO,
  ) {
    return this.tripService.updateStatusStudentTrip(
      studentId,
      tripId,
      dto.status,
    );
  }
}
