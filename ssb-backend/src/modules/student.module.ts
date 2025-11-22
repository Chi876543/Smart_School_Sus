import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { StudentController } from "src/controllers/student.controller";
import { StudentService } from "src/services/student.service";
import { StudentRepository } from "src/repositories/student.repository";
import { RouteRepository } from "src/repositories/route.repository";
import { StopRepository } from "src/repositories/stop.repository";


@Module({
    imports: [DatabaseModule],
    controllers: [StudentController],
    providers: [StudentService, StudentRepository, RouteRepository, StopRepository]
})

export class StudentModule{}
