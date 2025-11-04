import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Timetable – dữ liệu mẫu về khung thời gian hoạt động trong tuần.
 * Dùng để gán vào Schedule khi tạo lịch mới.
 */
@Schema({ collection: 'timetables', timestamps: true })
export class Timetable extends Document {
  // Ngày trong tuần (Monday–Sunday)
  @Prop({
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    required: true
  })
  dayOfWeek: string;

  // Giờ đón học sinh
  @Prop({ required: true })
  pickupTime: string; // ví dụ: "06:30"

  // Giờ trả học sinh
  @Prop({ required: true })
  dropoffTime: string; // ví dụ: "15:00"
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
