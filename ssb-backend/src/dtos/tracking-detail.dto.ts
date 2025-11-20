class stopDTO{
  name: string;
  lat: number;
  lng: number;
}

export class TripStudentDto {
  fullName: string;
  status: string;
}

export class TrackingDetailDto {
  scheduleId: string;
  plateNumber: string;
  driverName: string;
  routeName: string;
  stops: stopDTO[];
  students: TripStudentDto[];
}
