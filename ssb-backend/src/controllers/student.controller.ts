import { Controller, Get, Param } from "@nestjs/common";
import { StudentService } from "src/services/student.service";
import { NotFoundException } from '@nestjs/common';

@Controller('students')
export class StudentController{
    constructor(private readonly studentService: StudentService){}

    // Lấy học sinh theo routeId
    @Get(':routeId')
    async getStudentsByRouteId(@Param('routeId') routeId: string){
      return this.studentService.getStudentsFromRoute(routeId);
    }

    // Lấy tất cả học sinh
    @Get()
    async getAllStudent(){
      return this.studentService.getAllStudent();
    }

    // === API MỚI: /students/by-route/:routeId ===
  // Lấy học sinh theo routeId với format trả về đúng cho frontend
  @Get('by-route/:routeId')
  async getStudentsByRoute(@Param('routeId') routeId: string) {
    try {
      const students = await this.studentService.getStudentsFromRoute(routeId);

      // Chuyển đổi format đúng cho frontend
      return students.map(s => ({
        id: s.id.toString(),     // ObjectId → string
        name: s.fullname,        // fullname → name
      }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Không tìm thấy học sinh cho tuyến này');
    }
  }
}
