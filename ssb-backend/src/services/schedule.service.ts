import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, Types } from 'mongoose';
import { CreateScheduleDTO } from "src/dtos/createSchedule.dto";
import { ScheduleResponseDTO } from "src/dtos/scheduleResponse.dto";
import { UpdateScheduleDTO } from "src/dtos/updateSchedule.dto";
import { Schedule } from "src/schema";

@Injectable()
export class ScheduleService{
    constructor(
        @InjectModel(Schedule.name)
        private scheduleModel: Model<Schedule>
    ) {}

    async create(createDto: CreateScheduleDTO):Promise<ScheduleResponseDTO>{
        const schedule = new this.scheduleModel(createDto);
        const saved = await schedule.save();
        return plainToInstance(ScheduleResponseDTO, {
            id: saved.id.toString(),
            ...saved.toObject()
        });
    }

    async findAll():Promise<ScheduleResponseDTO[]>{
        const schedule = await this.scheduleModel
        .find()
        .populate('busId')
        .populate('driverId')
        .populate({
            path: 'routeId',
            populate:{
                path: 'stops.stopId',
                model: 'Stop'
            }
        })
        
        .populate('timeTables')
        .exec();

        return plainToInstance(ScheduleResponseDTO,
            schedule.map((s) => ({
                id: s.id.toString(),
                ...s.toObject()
            }))
        );
    }

    async findOne(id: String):Promise<ScheduleResponseDTO>{
        const schedule = await this.scheduleModel
        .findById(id)
        .populate('busId')
        .populate('driverId')
        .populate({
            path: 'routeId',
            populate:{
                path: 'stops.stopId',
                model: 'Stop'
            }
        })
        
        .populate('timeTables')
        .exec();
        
        if(!schedule) throw new NotFoundException(`Schedule ${id} not found`);
        return plainToInstance(ScheduleResponseDTO, {
            id: schedule.id.toString(),
            ...schedule.toObject()
        });
    }

    async update(id: String, updateDto: UpdateScheduleDTO):Promise<ScheduleResponseDTO>{
        const updated = await this.scheduleModel
        .findByIdAndUpdate(id, updateDto, {new : true})
        .exec();

        if(!updated) throw new NotFoundException(`Schedule ${id} not found`);
        return plainToInstance(ScheduleResponseDTO, {
            id: updated.id.toString(),
            ...updated.toObject()
        });
    }

    async remove(id: String):Promise<void>{
        const result = await this.scheduleModel
        .findByIdAndDelete(id)
        .exec();
        
        if (!result) throw new NotFoundException(`Schedule ${id} not found`);
    }
    
}