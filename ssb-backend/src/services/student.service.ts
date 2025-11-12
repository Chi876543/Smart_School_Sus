import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Route, Student } from "src/schema";


@Injectable()
export class StudentService{
    constructor(
        @InjectModel(Route.name) private readonly routeModel: Model<Route>,
        @InjectModel(Student.name) private readonly studentModel: Model<Student>
    ){}


    async getStudentsFromRoute(routeId: string){
          // Lấy thông tin route
          const route = await this.routeModel
          .findById(routeId)
          .populate({
                  path: 'stops.stopId',
                  model: 'Stop'
              })
          .lean();
    
          if(!route) throw new NotFoundException('Route not found');
    
          const stopIds = route.stops
          .sort((s1, s2) => s1.order - s2.order)
          .map((s) => s.stopId._id);
    
          const students = await this.studentModel
          .find({stopId: {$in: stopIds}})
          .lean();

          
          return students.map(stu =>({
            id: stu._id,
            fullname: stu.fullName,
            stopId: stu.stopId
          }))
        }
    
}
