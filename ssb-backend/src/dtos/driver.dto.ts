import { Expose } from "class-transformer";

export class DriverResponseDTO{
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    status: string
}