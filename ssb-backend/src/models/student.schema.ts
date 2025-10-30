import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'students' })
export class Student extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ type: Types.ObjectId, ref: 'Stop', default: null })
  stopId: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
