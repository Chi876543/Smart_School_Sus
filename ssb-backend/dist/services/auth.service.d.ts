import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../schema/admin.schema';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<Admin>, jwtService: JwtService);
    register(username: string, password: string): Promise<import("mongoose").Document<unknown, {}, Admin, {}, {}> & Admin & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
