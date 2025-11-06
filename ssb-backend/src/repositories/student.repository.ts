import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../schema/student.schema';

@Injectable()
export class StudentRepository {
  constructor(@InjectModel(Student.name) private readonly studentModel: Model<Student>) {}

  // async create(data: Partial<Student>) {
  //   return this.studentModel.create(data);
  // }

  async findAll() {
    return this.studentModel.find().populate('stopId').lean();
  }

  // async findById(id: string) {
  //   return this.studentModel.findById(new Types.ObjectId(id)).populate('stopId').lean();
  // }

  // async update(id: string, data: Partial<Student>) {
  //   return this.studentModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.studentModel.findByIdAndDelete(id);
  // }
}
