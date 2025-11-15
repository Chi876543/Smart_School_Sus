import { Controller, Get, Param } from "@nestjs/common";
import { StudentService } from "src/services/student.service";


@Controller('students')
export class StudentController{
    constructor(private readonly studentService: StudentService){}

    @Get(':routeId')
    getStudentsByRouteId(@Param('routeId') routeId: string){
        return this.studentService.getStudentsFromRoute(routeId);
    }

}