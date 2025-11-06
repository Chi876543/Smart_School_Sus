import { IsMongoId } from 'class-validator';

export class AssignScheduleDTO {
  @IsMongoId()
  driverId: string;

  @IsMongoId()
  busId: string;
}
