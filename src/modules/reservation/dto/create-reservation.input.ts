import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  fromDate: Date;

  @IsNotEmpty()
  @IsDateString()
  toDate: Date;

  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  roomIds: [number];
}
