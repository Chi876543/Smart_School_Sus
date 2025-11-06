import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateAssignScheduleDTO {
  @IsOptional()
  @IsMongoId()
  driverId?: string;

  @IsOptional()
  @IsMongoId()
  busId?: string;
}
