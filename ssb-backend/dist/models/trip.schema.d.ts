import { Document, Types } from 'mongoose';
export declare enum TripStatus {
    PLANNED = "planned",
    IN_PROGRESS = "inprogress",
    COMPLETED = "completed"
}
export declare enum TripStudentStatus {
    PICKUP = "pickup",
    ABSENT = "absent",
    DROPOFF = "dropoff",
    NOT_PICKUP = "not_pickup"
}
export declare class Trip extends Document {
    scheduleId: Types.ObjectId;
    status: TripStatus;
    date: Date;
    timeStart: string;
    timeEnd: string;
    students: {
        studentId: Types.ObjectId;
        status: TripStudentStatus;
    }[];
}
export declare const TripSchema: import("mongoose").Schema<Trip, import("mongoose").Model<Trip, any, any, any, Document<unknown, any, Trip, any, {}> & Trip & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Trip, Document<unknown, {}, import("mongoose").FlatRecord<Trip>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Trip> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
