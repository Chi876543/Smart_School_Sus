import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        password: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../models").Admin, {}, {}> & import("../models").Admin & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        userId: unknown;
    }>;
}
