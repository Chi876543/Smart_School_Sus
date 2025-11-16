import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Timetable } from '../schema/timetable.schema';

@Injectable()
export class TimetableRepository {
  constructor(@InjectModel(Timetable.name) private readonly timetableModel: Model<Timetable>) {}

  // async create(data: Partial<Timetable>) {
  //   return this.timetableModel.create(data);
  // }

  async findAll() {
    return this.timetableModel.find().lean();
  }

  // async findById(id: string) {
  //   return this.timetableModel.findById(new Types.ObjectId(id)).lean();
  // }

  // async update(id: string, data: Partial<Timetable>) {
  //   return this.timetableModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.timetableModel.findByIdAndDelete(id);
  // }
}
