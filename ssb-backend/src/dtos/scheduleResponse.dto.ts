import { Expose, Type } from "class-transformer";
import { BusResponseDTO } from "./bus.dto";
import { DriverResponseDTO } from "./driver.dto";
import { RouteResponseDTO } from "./route.dto";
import { TimeTableResponseDTO } from "./timeTableResponse.dto";

export class ScheduleResponseDTO{
    @Expose()
    id: string;
    @Expose()
    status: string;
    @Expose()
    name: string;
    @Expose()
    dateStart: Date;
    @Expose()
    dateEnd: Date;
    @Expose()

    @Type(() => BusResponseDTO)
    @Expose()
    bus: BusResponseDTO;

    @Type(() => DriverResponseDTO)
    @Expose()
    driver: DriverResponseDTO;

    @Type(() => RouteResponseDTO)
    @Expose()
    route: RouteResponseDTO;

    @Type(() => TimeTableResponseDTO)
    @Expose()
    timeTables: TimeTableResponseDTO[]
}