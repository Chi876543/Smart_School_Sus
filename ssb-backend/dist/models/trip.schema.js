"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripSchema = exports.Trip = exports.TripStudentStatus = exports.TripStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TripStatus;
(function (TripStatus) {
    TripStatus["PLANNED"] = "planned";
    TripStatus["IN_PROGRESS"] = "inprogress";
    TripStatus["COMPLETED"] = "completed";
})(TripStatus || (exports.TripStatus = TripStatus = {}));
var TripStudentStatus;
(function (TripStudentStatus) {
    TripStudentStatus["PICKUP"] = "pickup";
    TripStudentStatus["ABSENT"] = "absent";
    TripStudentStatus["DROPOFF"] = "dropoff";
    TripStudentStatus["NOT_PICKUP"] = "not_pickup";
})(TripStudentStatus || (exports.TripStudentStatus = TripStudentStatus = {}));
let Trip = class Trip extends mongoose_2.Document {
    scheduleId;
    status;
    date;
    timeStart;
    timeEnd;
    students;
};
exports.Trip = Trip;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Schedule', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Trip.prototype, "scheduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: TripStatus, default: TripStatus.PLANNED }),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Trip.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Trip.prototype, "timeStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Trip.prototype, "timeEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                studentId: { type: mongoose_2.Types.ObjectId, ref: 'Student' },
                status: { type: String, enum: Object.values(TripStudentStatus) },
            },
        ],
    }),
    __metadata("design:type", Array)
], Trip.prototype, "students", void 0);
exports.Trip = Trip = __decorate([
    (0, mongoose_1.Schema)({ collection: 'trips' })
], Trip);
exports.TripSchema = mongoose_1.SchemaFactory.createForClass(Trip);
exports.TripSchema.index({ 'students.status': 1 }, { name: 'idx_tripstudent_status' });
//# sourceMappingURL=trip.schema.js.map