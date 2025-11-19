import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private jwtService: JwtService
  ) {}

  // async register(username: string, password: string) {
  //   const existing = await this.userModel.findOne({ username });
  //   if (existing) throw new Error('Username already exists');

  //   const saltRounds = 10;
  //   const hash = await bcrypt.hash(password, saltRounds);
  //   const newUser = new this.userModel({ username, password: hash });
  //   return newUser.save();
  //   }

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findByUsername(dto.username);
    if (!user) throw new Error('Invalid credentials');

    if (dto.password !== user.password) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({sub: user._id, username: user.username});

    return {
      token: token,
      username: user.username
    };
    }
}
