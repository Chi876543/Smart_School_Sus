import { IsMongoId, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SuaPhanCongDTO {
  @IsOptional()
  @IsMongoId({ message: 'busId phải là ObjectId hợp lệ' })
  busId?: string;

  @IsOptional()
  @IsMongoId({ message: 'driverId phải là ObjectId hợp lệ' })
  driverId?: string;

  @IsOptional()
  @IsMongoId({ message: 'routeId phải là ObjectId hợp lệ' })
  routeId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Mỗi timetableId phải là ObjectId hợp lệ' })
  timeTableIds?: string[];
}
