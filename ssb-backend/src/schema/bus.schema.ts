import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'buses' })
export class Bus extends Document {
  @Prop({ required: true, unique: true })
  plateNumber: string;

  @Prop({ type: Number, default: null })
  lat: number;

  @Prop({ type: Number, default: null })
  lng: number;

  @Prop({ type: Number, default: null })
  speed: number; // km/h

  @Prop({ required: true })
  status: string; // 'offline', 'online', etc.

  @Prop({ required: true })
  capacity: number;
}

export const BusSchema = SchemaFactory.createForClass(Bus);
