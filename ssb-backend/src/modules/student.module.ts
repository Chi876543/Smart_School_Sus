import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { StudentController } from "src/controllers/student.controller";
import { StudentService } from "src/services/student.service";


@Module({
    imports: [DatabaseModule],
    controllers: [StudentController],
    providers: [StudentService]
})

export class StudentModule{}
