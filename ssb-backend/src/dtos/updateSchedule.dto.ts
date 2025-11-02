import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDTO } from './createSchedule.dto';

export class UpdateScheduleDTO extends PartialType(CreateScheduleDTO){}