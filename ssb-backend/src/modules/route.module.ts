import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { RouteController } from "src/controllers/route.controller";
import { RouteService } from "src/services/route.service";
import { RouteRepository } from "src/repositories/route.repository";
import { StopRepository } from "src/repositories/stop.repository";


@Module({
    imports: [DatabaseModule],
    controllers: [RouteController],
    providers: [RouteService, RouteRepository, StopRepository]
})

export class RouteModule{}