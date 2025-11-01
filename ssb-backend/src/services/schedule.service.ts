import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import { Schedule } from "src/models";

@Injectable()
export class ScheduleService{
    constructor(
        @InjectModel(Schedule.name)
        private scheduleModel: Model<Schedule>
    ) {}

    async create(createDto: Partial<Schedule>):Promise<Schedule>{
        const schedule = new this.scheduleModel(createDto);
        return schedule.save();
    }

    async findAll():Promise<Schedule[]>{
        return this.scheduleModel
        .find()
        .populate('busID driverId routeId')
        .exec();
    }

    async findOne(id: String):Promise<Schedule>{
        const schedule = await this.scheduleModel
        .findById(id)
        .populate('busId driverId routeId')
        .exec();
        
        if(!schedule) throw new NotFoundException(`Schedule ${id} not found`);
        return schedule;
    }

    async update(id: String, updateDto: Partial<Schedule>):Promise<Schedule>{
        const updated = await this.scheduleModel
        .findByIdAndUpdate(id, updateDto, {new : true})
        .exec();

        if(!updated) throw new NotFoundException(`Schedule ${id} not found`);
        return updated;
    }

    async remove(id: String):Promise<void>{
        const result = await this.scheduleModel
        .findByIdAndDelete(id)
        .exec();
        
        if (!result) throw new NotFoundException(`Schedule ${id} not found`);
    }
}