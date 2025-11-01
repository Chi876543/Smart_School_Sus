import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Admin.name) private userModel: Model<Admin>) {}

  async register(username: string, password: string) {
    const existing = await this.userModel.findOne({ username });
    if (existing) throw new Error('Username already exists');

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new this.userModel({ username, password: hash });
    return newUser.save();
    }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    // trả token / userId tùy bạn (nên dùng JWT)
    return { message: 'Login success', userId: user._id };
    }
}
