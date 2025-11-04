import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'routes' })
export class Route extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Number, default: 0 })
  distance: number; // km

  @Prop({
    type: [
      {
        stopId: { type: Types.ObjectId, ref: 'Stop' },
        order: { type: Number, required: true },
      },
    ],
  })
  stops: { stopId: Types.ObjectId; order: number }[];
}

export const RouteSchema = SchemaFactory.createForClass(Route);
