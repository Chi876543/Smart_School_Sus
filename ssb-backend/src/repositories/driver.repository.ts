import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Driver } from '../schema/driver.schema';

@Injectable()
export class DriverRepository {
  constructor(@InjectModel(Driver.name) private readonly driverModel: Model<Driver>) {}

  // async create(data: Partial<Driver>) {
  //   return this.driverModel.create(data);
  // }

  async findAll() {
    return this.driverModel.find().lean();
  }

  // Lấy thông tin tài xế
  async findDriverById(driverId: string) {
    return this.driverModel.findById(driverId);
  }

  // async update(id: string, data: Partial<Driver>) {
  //   return this.driverModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.driverModel.findByIdAndDelete(id);
  // }
}
