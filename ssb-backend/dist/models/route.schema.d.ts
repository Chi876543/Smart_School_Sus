import { Document, Types } from 'mongoose';
export declare class Route extends Document {
    name: string;
    active: boolean;
    distance: number;
    stops: {
        stopId: Types.ObjectId;
        order: number;
    }[];
}
export declare const RouteSchema: import("mongoose").Schema<Route, import("mongoose").Model<Route, any, any, any, Document<unknown, any, Route, any, {}> & Route & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Route, Document<unknown, {}, import("mongoose").FlatRecord<Route>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Route> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
