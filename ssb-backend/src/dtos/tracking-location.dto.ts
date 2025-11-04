import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TrackingLocationDto {
  @IsMongoId()
  busId: string;

  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  speed?: number;
}
