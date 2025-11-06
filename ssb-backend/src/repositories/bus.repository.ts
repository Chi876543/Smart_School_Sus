import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bus } from '../schema/bus.schema';

@Injectable()
export class BusRepository {
  constructor(@InjectModel(Bus.name) private readonly busModel: Model<Bus>) {}

//   async create(data: Partial<Bus>) {
//     return this.busModel.create(data);
//   }

  async findAll() {
    return this.busModel.find().lean();
  }

  // Lấy thông tin xe buýt
  async findBusById(busId: string) {
    return this.busModel.findById(busId);
  }

  // Cập nhật vị trí xe buýt
  async updateBusLocation(busId: string, lat: number, lng: number, speed?: number) {
    return this.busModel.findByIdAndUpdate(
      busId,
      { lat, lng, speed, status: 'online' },
      { new: true },
    );
  }

//   async update(id: string, data: Partial<Bus>) {
//     return this.busModel.findByIdAndUpdate(id, data, { new: true }).lean();
//   }

//   async delete(id: string) {
//     return this.busModel.findByIdAndDelete(id);
//   }
}
