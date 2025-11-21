import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'schedules' })
export class Schedule extends Document {
  @Prop({
  type: String,
  enum: ['unassigned', 'planned', 'active', 'completed', 'suspended', 'cancelled'],
  default: 'unassigned',
  })
  status: string;

  // unassigned Chưa phân công xe, tài xế, hoặc khi gỡ phân công
  // planned	Đã phân công đủ, chờ ngày bắt đầu	Khi busId, driverId đã có
  // active	Đang hoạt động	Trong khoảng ngày
  // completed	Đã hoàn thành	Sau ngày kết thúc
  // suspended	Tạm dừng	Do lỗi kỹ thuật, bảo trì
  // cancelled	Hủy bỏ	Khi admin hủy

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  dateStart: Date;

  @Prop({ required: true, type: Date })
  dateEnd: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: false, default: null })
  busId?: mongoose.Schema.Types.ObjectId | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false, default: null })
  driverId?: mongoose.Schema.Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  routeId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Timetable' }] })
  timeTables: Types.ObjectId[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
