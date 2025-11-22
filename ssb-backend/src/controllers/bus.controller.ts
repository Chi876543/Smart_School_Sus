import { Controller, Get } from "@nestjs/common";
import { BusService } from "src/services/bus.service";


@Controller('buses')
export class BusController{
    constructor(private readonly busService: BusService){}

    @Get()
    async getAllBuses(){
        return this.busService.getAllBuses();
    }
}