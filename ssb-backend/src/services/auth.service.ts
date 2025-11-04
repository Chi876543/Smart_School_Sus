import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../schema/admin.schema';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private userModel: Model<Admin>,
    private jwtService: JwtService
  ) {}

  async register(username: string, password: string) {
    const existing = await this.userModel.findOne({ username });
    if (existing) throw new Error('Username already exists');

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new this.userModel({ username, password: hash });
    return newUser.save();
    }

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare( dto.password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({sub: user._id, username: user.username});

    return {
      token: token,
      username: user.username
    };
    }
}
