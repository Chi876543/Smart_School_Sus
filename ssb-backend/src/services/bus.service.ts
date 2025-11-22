import { Injectable, NotFoundException } from "@nestjs/common";
import { BusRepository } from "src/repositories/bus.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { ScheduleRepository } from "src/repositories/schedule.repository";



@Injectable()
export class BusService{
    constructor(
        private readonly busRepo: BusRepository,
        private readonly scheduleRepo: ScheduleRepository,
        private readonly routeRepo: RouteRepository
    ){}

    async getAllBuses() {
        const buses = await this.busRepo.findAll();
        if (!buses || buses.length === 0)
            throw new NotFoundException("cannot find buses");

        const schedules = await this.scheduleRepo.findActiveSchedules();

        const busesWithRoutes = await Promise.all(
            buses.map(async(bus) => {
                // Only include schedules with status 'active'
                const assignedSchedules = schedules.filter(
                (s) =>
                    s.busId &&
                    s.busId.toString() === bus._id.toString()
                );

                const assignedRouteIds = [...new Set(assignedSchedules.map((s) => s.routeId))];

                const routes = await Promise.all(
                    assignedRouteIds.map(async (id) => {
                        const route = await this.routeRepo.findById(id.toString());
                        return route?.name ?? null;
                    })
                );

                // Filter out nulls
                const assignedRoutes = routes.filter((r) => r !== null);

                return {
                    id: bus._id.toString(),
                    plateNum: bus.plateNumber,
                    capacity: bus.capacity,
                    assignedRoutes,
                };
            }));

        return busesWithRoutes;
    }

}