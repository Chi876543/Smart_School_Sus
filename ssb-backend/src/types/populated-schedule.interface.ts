// src/types/populated-schedule.interface.ts
import { Types } from 'mongoose';

export interface PopulatedBus {
  _id: Types.ObjectId;
  plateNumber: string;
  lat: number | null;
  lng: number | null;
  speed: number | null;
  status: string;
  capacity: number;
}

export interface PopulatedDriver {
  _id: Types.ObjectId;
  name: string;
  status: string;
}

export interface PopulatedStop {
  _id: Types.ObjectId;
  name: string;
  lat: number;
  lng: number;
  active: boolean;
}

export interface PopulatedRoute {
  _id: Types.ObjectId;
  name: string;
  active: boolean;
  distance: number;
  stops: { stopId: PopulatedStop; order: number }[];
}

export interface PopulatedSchedule {
  _id: Types.ObjectId;
  status: string;
  name: string;
  dateStart: Date;
  dateEnd: Date;
  busId: PopulatedBus;
  driverId: PopulatedDriver;
  routeId: PopulatedRoute;
}