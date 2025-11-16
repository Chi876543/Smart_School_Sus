import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Route } from '../schema/route.schema';
import { Stop } from '../schema/stop.schema';

@Injectable()
export class RouteRepository {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<Route>,
    @InjectModel(Stop.name) private readonly stopModel: Model<Stop>) {}

  // async create(data: Partial<Route>) {
  //   return this.routeModel.create(data);
  // }

  async findAll() {
    return this.routeModel.find().populate('stops').lean();
  }

  async findAllRoute() {
    return this.routeModel.find().lean();
  }

  // Lấy thông tin tuyến đường
  async findRouteById(routeId: string) {
    return this.routeModel.findById(routeId);
  }

  // Lấy danh sách điểm dừng (Stop) của 1 Route
  async findStopsByRouteId(routeId: string) {
    const route = await this.routeModel.findById(routeId).lean();
    if (!route?.stops?.length) return [];

    const stopIds = route.stops.map((s: any) => new Types.ObjectId(s.stopId));

    const stops = await this.stopModel.find({ _id: { $in: stopIds } }).lean();

    // sắp xếp đúng thứ tự
    return route.stops
      .sort((a: any, b: any) => a.order - b.order)
      .map((s: any) => stops.find((st: any) => st._id.toString() === s.stopId.toString()))
      .filter(Boolean);
  }

  // async update(id: string, data: Partial<Route>) {
  //   return this.routeModel.findByIdAndUpdate(id, data, { new: true }).lean();
  // }

  // async delete(id: string) {
  //   return this.routeModel.findByIdAndDelete(id);
  // }
}
