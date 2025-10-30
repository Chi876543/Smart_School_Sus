import { Document } from 'mongoose';
export declare class Stop extends Document {
    name: string;
    lat: number;
    lng: number;
    active: boolean;
}
export declare const StopSchema: import("mongoose").Schema<Stop, import("mongoose").Model<Stop, any, any, any, Document<unknown, any, Stop, any, {}> & Stop & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Stop, Document<unknown, {}, import("mongoose").FlatRecord<Stop>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Stop> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
