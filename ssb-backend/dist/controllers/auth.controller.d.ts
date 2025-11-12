import { AuthService } from '../services/auth.service';
import { LoginRequestDTO } from 'src/dtos/loginRequest.dto';
import { LoginResponseDTO } from 'src/dtos/loginResponse.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
