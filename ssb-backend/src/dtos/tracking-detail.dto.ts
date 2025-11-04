export class NextStopDto {
  name: string;
  lat: number;
  lng: number;
  distance: number;
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
  nextStop: NextStopDto;
  eta: number;
  students: TripStudentDto[];
}
