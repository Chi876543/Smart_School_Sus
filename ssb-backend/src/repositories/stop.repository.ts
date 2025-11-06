import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Stop } from '../schema/stop.schema';

@Injectable()
export class StopRepository {
  constructor(@InjectModel(Stop.name) private readonly stopModel: Model<Stop>) {}

  // async create(data: Partial<Stop>) {
  //   return this.stopModel.create(data);
  // }

  // async findAll() {
  //   return this.stopModel.find().lean();
  // }

  // async findById(id: string) {
  //   return this.stopModel.findById(new Types.ObjectId(id)).lean();
  // }

  // async update(id: string, data: Partial<Stop>) {
  //   return this.stopModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.stopModel.findByIdAndDelete(id);
  // }
}
