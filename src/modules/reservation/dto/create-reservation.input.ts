import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  fromDate: Date;

  @IsDate()
  toDate: Date;

  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  roomIds: [number];
}
