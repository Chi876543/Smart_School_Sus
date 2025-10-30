import { Document } from 'mongoose';
export declare class Driver extends Document {
    name: string;
    status: string;
}
export declare const DriverSchema: import("mongoose").Schema<Driver, import("mongoose").Model<Driver, any, any, any, Document<unknown, any, Driver, any, {}> & Driver & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Driver, Document<unknown, {}, import("mongoose").FlatRecord<Driver>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Driver> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
