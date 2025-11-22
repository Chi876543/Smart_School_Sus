import { Injectable, NotFoundException } from "@nestjs/common";
import { DriverRepository } from "src/repositories/driver.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { ScheduleRepository } from "src/repositories/schedule.repository";


@Injectable()
export class DriverService{
    constructor(
        private readonly driverRepo: DriverRepository,
        private readonly scheduleRepo: ScheduleRepository,
        private readonly routeRepo: RouteRepository
    ){}

    async getAllDriver() {
        const drivers = await this.driverRepo.findAll();
        if (!drivers || drivers.length === 0)
            throw new NotFoundException("cannot find drivers");

        const schedules = await this.scheduleRepo.findActiveSchedules();

        const driversWithRoutes = await Promise.all(
            drivers.map(async(driver) => {
                // Only include schedules with status 'active'
                const assignedSchedules = schedules.filter(
                (s) =>
                    s.driverId &&
                    s.driverId.toString() === driver._id.toString()
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
                    id: driver._id.toString(),
                    fullName: driver.name,
                    assignedRoutes,
                };
            }));

        return driversWithRoutes;
    }

}