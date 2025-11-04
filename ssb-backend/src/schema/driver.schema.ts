import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'drivers' })
export class Driver extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: string; // 'active' | 'inactive'
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
