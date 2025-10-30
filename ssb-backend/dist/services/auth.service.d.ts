import { Model } from 'mongoose';
import { Admin } from '../models/admin.schema';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<Admin>);
    register(username: string, password: string): Promise<import("mongoose").Document<unknown, {}, Admin, {}, {}> & Admin & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(username: string, password: string): Promise<{
        message: string;
        userId: unknown;
    }>;
}
