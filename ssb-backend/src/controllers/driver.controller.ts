import { Controller, Get } from "@nestjs/common";
import { DriverService } from "src/services/driver.service";

@Controller('drivers')
export class DriverController{
    constructor(private readonly driverService: DriverService){}

    @Get()
    async getAllDrivers(){
        return this.driverService.getAllDriver();
    }
}