import { AuthService } from '../services/auth.service';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        password: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schema").Admin, {}, {}> & import("../schema").Admin & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
