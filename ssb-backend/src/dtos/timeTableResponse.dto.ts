import { Expose } from "class-transformer";

export class TimeTableResponseDTO{
    @Expose()
    id: string;
    @Expose()
    dayOfWeek: string;
    @Expose()
    pickupTime: string;
    @Expose()
    dropOffTime: string;
    
}