import { IsDate, IsMongoId, IsString } from "class-validator";import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDTO } from './createSchedule.dto';

export class UpdateScheduleDTO {
    @IsString()
    name: string;
    
    @IsDate()
    dateStart: Date;
    
    @IsDate()
    dateEnd: Date;
    
    @IsString()
    status: string;
    
    @IsMongoId()
    busId: string;
    
    @IsMongoId()
    driverId: string;
    
    @IsMongoId()
    routeId: string;
    
    @IsMongoId({ each: true })
    timeTables?: string[];
}