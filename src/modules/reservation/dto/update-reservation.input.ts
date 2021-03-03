import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  fromDate: Date;

  @IsNotEmpty()
  @IsDateString()
  toDate: Date;

  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  roomId: number;

  permanenceId: number;
}
