export declare class MapService {
    private client;
    getDistance(origin: string, destination: string): Promise<import("@googlemaps/google-maps-services-js").DistanceMatrixRowElement>;
    getGeocode(address: string): Promise<import("@googlemaps/google-maps-services-js").GeocodeResult>;
}
