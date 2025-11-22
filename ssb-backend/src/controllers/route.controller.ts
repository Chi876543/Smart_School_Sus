import { Controller, Get } from "@nestjs/common";
import { RouteService } from "src/services/route.service";


@Controller('routes')
export class RouteController{
    constructor(private readonly routeService: RouteService){}

    @Get()
    async getAllRoutes(){
        return this.routeService.getAllRoute();
    }
}