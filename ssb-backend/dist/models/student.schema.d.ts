import { Document, Types } from 'mongoose';
export declare class Student extends Document {
    fullName: string;
    stopId: Types.ObjectId;
}
export declare const StudentSchema: import("mongoose").Schema<Student, import("mongoose").Model<Student, any, any, any, Document<unknown, any, Student, any, {}> & Student & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Student, Document<unknown, {}, import("mongoose").FlatRecord<Student>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Student> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
