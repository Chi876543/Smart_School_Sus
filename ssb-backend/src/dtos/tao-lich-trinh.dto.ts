import {
  IsString,
  IsDate,
  IsMongoId,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class StudentInputDTO {
  @IsMongoId({ message: 'studentId phải là ObjectId hợp lệ' })
  studentId: string;

  @IsMongoId({ message: 'stopId phải là ObjectId hợp lệ' })
  stopId: string;
}

export class TaoLichTrinhDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date)
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  dateEnd: Date;

  @IsMongoId()
  busId: string;

  @IsMongoId()
  driverId: string;

  @IsMongoId()
  routeId: string;

  @IsArray()
  @IsMongoId({ each: true })
  timetableIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentInputDTO)
  students: StudentInputDTO[];
}
