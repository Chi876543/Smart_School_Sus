import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "src/schema";


@Injectable()
export class UserRepository {
    constructor(@InjectModel(Admin.name) private readonly userModel: Model<Admin>){}

    async findByUsername(username: string){
        const user = await this.userModel.findOne({username});
        return user;
    }
}