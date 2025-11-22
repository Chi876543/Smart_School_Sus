import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "src/repositories/route.repository";
import { StopRepository } from "src/repositories/stop.repository";
import axios from 'axios';


@Injectable()
export class RouteService{
    constructor(
        private readonly routeRepo: RouteRepository,
        private readonly stopRepo: StopRepository,
    ){}

    async getAllRoute() {
        function delay(ms: number) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        const routes = await this.routeRepo.findAll();
        if(routes.length === 0) throw new NotFoundException("cannot find route")

        const routesWithStops = await Promise.all(
            routes.map(async (route) => {
            // fetch stop info
            const stops = await Promise.all(
                route.stops.map(async (s) => {
                const stop = await this.stopRepo.findById(s.stopId.toString());
                return {
                    name: stop?.name || "Unknown",
                    order: s.order,
                    lat: stop?.lat,
                    lng: stop?.lng,
                };
                })
            );

            // sort by order
            stops.sort((a, b) => a.order - b.order);

            // compute distance using OSRM
            let distance = 0;
            if (stops.length > 1) {
                const coords = stops.map((s) => `${s.lng},${s.lat}`).join(";");
                try {
                    const res = await axios.get(`http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
                    delay(500)
                    const data = res.data as { routes: { distance: number }[] };
                    if (data.routes && data.routes[0]) {
                        distance = data.routes[0].distance;
                    }
                } catch (err) {
                    console.error("OSRM error:", err.message);
                }
            }

            return {
                id: route._id.toString(),
                name: route.name,
                stops,
                distance,
                status: route.active ? "active" : "inactive",
            };
            })
        );

        return routesWithStops;
    }

}