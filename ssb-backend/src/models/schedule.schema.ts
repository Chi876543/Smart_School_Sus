import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'schedules' })
export class Schedule extends Document {
  @Prop({ required: true })
  status: string; // 'active' | 'inactive'

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  dateStart: Date;

  @Prop({ required: true, type: Date })
  dateEnd: Date;

  @Prop({ type: Types.ObjectId, ref: 'Bus', required: true })
  busId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Driver', required: true })
  driverId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  routeId: Types.ObjectId;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
