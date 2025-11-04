import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TripStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

export enum TripStudentStatus {
  PICKUP = 'pickup',
  ABSENT = 'absent',
  DROPOFF = 'dropoff',
  NOT_PICKUP = 'not_pickup',
}

@Schema({ collection: 'trips' })
export class Trip extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Schedule', required: true })
  scheduleId: Types.ObjectId;

  @Prop({ enum: TripStatus, default: TripStatus.PLANNED })
  status: TripStatus;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: String, default: null })
  timeStart: string;

  @Prop({ type: String, default: null })
  timeEnd: string;

  @Prop({
    type: [
      {
        studentId: { type: Types.ObjectId, ref: 'Student' },
        status: { type: String, enum: Object.values(TripStudentStatus) },
      },
    ],
  })
  students: {
    studentId: Types.ObjectId;
    status: TripStudentStatus;
  }[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ 'students.status': 1 }, { name: 'idx_tripstudent_status' });
