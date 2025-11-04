import { Expose } from "class-transformer";

export class BusResponseDTO{
    @Expose()
    id: string;
    @Expose()
    plateNumber: string;
    @Expose()
    lattitude: number | null;
    @Expose()
    longtitude: number | null;
    @Expose()
    speed: number | null;
    @Expose()
    status: string;
    @Expose()
    capacity: number
}