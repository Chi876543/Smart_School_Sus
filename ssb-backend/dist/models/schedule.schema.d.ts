import { Document, Types } from 'mongoose';
export declare class Schedule extends Document {
    status: string;
    name: string;
    dateStart: Date;
    dateEnd: Date;
    busId: Types.ObjectId;
    driverId: Types.ObjectId;
    routeId: Types.ObjectId;
}
export declare const ScheduleSchema: import("mongoose").Schema<Schedule, import("mongoose").Model<Schedule, any, any, any, Document<unknown, any, Schedule, any, {}> & Schedule & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Schedule, Document<unknown, {}, import("mongoose").FlatRecord<Schedule>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Schedule> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
