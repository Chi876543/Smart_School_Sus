import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "src/repositories/route.repository";
import { StopRepository } from "src/repositories/stop.repository";
import { StudentRepository } from "src/repositories/student.repository";


@Injectable()
export class StudentService{
    constructor(
        private readonly routeRepo: RouteRepository,
        private readonly studentRepo: StudentRepository,
        private readonly stopRepo: StopRepository
    ){}

    async getStudentsFromRoute(routeId: string){
      const stops = await this.routeRepo.findStopsByRouteId(routeId)
      if(stops.length === 0) throw new NotFoundException('Stops not found');

      const stopIds = stops
      .map((s) => s?._id.toString());

      const students = (await this.studentRepo.findAll())
      .filter(stu => stopIds.includes(stu.stopId._id.toString()))
      
      return students.map(stu =>({
        id: stu._id,
        fullname: stu.fullName,
        stopId: stu.stopId._id
      }))
    }

   async getAllStudent() {
    const students = await this.studentRepo.findAll();
    if (!students || students.length === 0)
      throw new NotFoundException("cannot find students");

    const result = await Promise.all(
      students.map(async (stu) => {
        const stop = await this.stopRepo.findById(stu.stopId._id.toString());
        if (!stop) throw new NotFoundException("cannot find students");

        return {
          id: stu._id.toString(),
          fullName: stu.fullName,
          stopName: stop.name,
        };
      })
    );

    return result;
  }

    
    
}
