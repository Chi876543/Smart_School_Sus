import { IsDate, IsMongoId, IsString } from "class-validator";

export class CreateScheduleDTO{
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
}