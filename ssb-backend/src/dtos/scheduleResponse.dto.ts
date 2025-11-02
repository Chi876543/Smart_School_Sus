import { Type } from "class-transformer";
import { BusResponseDTO } from "./bus.dto";
import { DriverResponseDTO } from "./driver.dto";
import { RouteResponseDTO } from "./route.dto";

export class ScheduleResponseDTO{
    id: string;
    status: string;
    name: string;
    dateStart: Date;
    dateEnd: Date;

    @Type(() => BusResponseDTO)
    bus: BusResponseDTO;

    @Type(() => DriverResponseDTO)
    driver: DriverResponseDTO;

    @Type(() => RouteResponseDTO)
    route: RouteResponseDTO;
}