import { Expose, Type } from 'class-transformer';
import { StopResponseDTO } from "./stop.dto";

class StopOrderReponseDTO{
    @Type(() => StopResponseDTO)
    @Expose()
    stop: StopResponseDTO;
    @Expose()
    order: number;
}

export class RouteResponseDTO{
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    active: boolean;
    @Expose()
    distance: number;

    @Type(() => StopOrderReponseDTO)
    @Expose()
    stops: StopOrderReponseDTO[];

}