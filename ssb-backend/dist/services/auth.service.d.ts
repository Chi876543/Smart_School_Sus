import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../schema/admin.schema';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<Admin>, jwtService: JwtService);
    login(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
