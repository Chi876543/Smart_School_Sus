import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateScheduleDTO } from "src/dtos/createSchedule.dto";
import { UpdateScheduleDTO } from "src/dtos/updateSchedule.dto";
import { Schedule } from "src/schema";
import { ScheduleService } from "src/services/schedule.service";

@Controller('schedules')
export class ScheduleController{
    constructor( private readonly scheduleService:ScheduleService){

    }

    // @Post()
    // create(@Body() createDto:CreateScheduleDTO){
    //     return this.scheduleService.create(createDto);
    // }

    @Get()
    findAll(){
        return this.scheduleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:String){
        return this.scheduleService.findOne(id);
    }

    // @Put(':id')
    // update(@Param('id') id:String, @Body() updateDto:UpdateScheduleDTO){
    //     return this.scheduleService.update(id, updateDto);
    // }

    @Delete(':id')
    remove(@Param('id') id:String){
        return this.scheduleService.remove(id);
    }
}