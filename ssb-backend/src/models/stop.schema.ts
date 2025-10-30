import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'stops' })
export class Stop extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  lat: number;

  @Prop({ required: true, type: Number })
  lng: number;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;
}

export const StopSchema = SchemaFactory.createForClass(Stop);
