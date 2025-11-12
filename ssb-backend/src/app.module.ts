import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth.module';
import { TrackingModule } from './modules/tracking.module';
import { AssignModule } from './modules/assignment.module';
import { ScheduleModule } from './modules/schedule.module';

import { DatabaseModule } from './modules/database.module';
import { StudentModule } from './modules/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    StudentModule,
    DatabaseModule,
    AssignModule,
    ScheduleModule,
    AuthModule,
    TrackingModule,

  ],
})
export class AppModule {}
