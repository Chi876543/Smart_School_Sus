import { Type } from 'class-transformer';
import { StopResponseDTO } from "./stop.dto";

class StopOrderReponseDTO{
    @Type(() => StopResponseDTO)
    stop: StopResponseDTO;
    order: number;
}

export class RouteResponseDTO{
    id: string;
    name: string;
    active: boolean;
    distance: number;

    @Type(() => StopOrderReponseDTO)
    stops: StopOrderReponseDTO[];

}