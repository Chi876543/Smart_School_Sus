import { MapService } from '../services/map.service';
export declare class MapController {
    private readonly mapService;
    constructor(mapService: MapService);
    getDistance(origin: string, destination: string): Promise<import("@googlemaps/google-maps-services-js").DistanceMatrixRowElement>;
    getGeocode(address: string): Promise<import("@googlemaps/google-maps-services-js").GeocodeResult>;
}
