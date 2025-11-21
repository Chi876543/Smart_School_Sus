import { IsEnum, IsNotEmpty } from 'class-validator';
import { TripStudentStatus } from '../schema/trip.schema';

export class UpdateTripStudentStatusDTO {
  @IsNotEmpty()
  @IsEnum(TripStudentStatus)
  status: TripStudentStatus;
}
