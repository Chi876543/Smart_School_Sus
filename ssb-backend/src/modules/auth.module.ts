import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { Admin, AdminSchema } from '../models/admin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
