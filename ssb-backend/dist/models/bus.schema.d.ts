import { Document } from 'mongoose';
export declare class Bus extends Document {
    plateNumber: string;
    lat: number;
    lng: number;
    speed: number;
    status: string;
    capacity: number;
}
export declare const BusSchema: import("mongoose").Schema<Bus, import("mongoose").Model<Bus, any, any, any, Document<unknown, any, Bus, any, {}> & Bus & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bus, Document<unknown, {}, import("mongoose").FlatRecord<Bus>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Bus> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
