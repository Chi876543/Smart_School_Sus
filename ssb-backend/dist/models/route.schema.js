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
exports.RouteSchema = exports.Route = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Route = class Route extends mongoose_2.Document {
    name;
    active;
    distance;
    stops;
};
exports.Route = Route;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Route.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Route.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Route.prototype, "distance", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                stopId: { type: mongoose_2.Types.ObjectId, ref: 'Stop' },
                order: { type: Number, required: true },
            },
        ],
    }),
    __metadata("design:type", Array)
], Route.prototype, "stops", void 0);
exports.Route = Route = __decorate([
    (0, mongoose_1.Schema)({ collection: 'routes' })
], Route);
exports.RouteSchema = mongoose_1.SchemaFactory.createForClass(Route);
//# sourceMappingURL=route.schema.js.map