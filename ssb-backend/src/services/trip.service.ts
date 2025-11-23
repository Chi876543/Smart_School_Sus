import { Injectable, NotFoundException } from "@nestjs/common";
import { TripRepository } from "src/repositories/trip.repository";
import { TripStudentStatus } from '../schema/trip.schema';


@Injectable()
export class TripService{
    constructor(
        private readonly tripRepo: TripRepository
    ){}

    // Cập nhật trạng thái của học sinh trong chuyến đi
    async updateStatusStudentTrip(studentId: string, tripId: string, status: TripStudentStatus){
        const trip =  await this.tripRepo.findstudentInTrip(tripId, studentId);
        if(!trip) throw new NotFoundException('Trip or Student not found in trip');
        trip.students = trip.students.map(s => {
            if(s.studentId.toString() === studentId){
                s.status = status;
            }
            return s;
        });
        await trip.save();
        return {
            message: 'Student status updated successfully',
            trip,
        };
    } 
}
