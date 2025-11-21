import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { TripController } from "src/controllers/trip.controller";
import { TripService } from "src/services/trip.service";
import { TripRepository } from "src/repositories/trip.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [TripController],
    providers: [TripService, TripRepository]
})

export class TripModule{}
