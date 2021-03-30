import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateReservationDto {
  @IsDate()
  fromDate: Date;

  @IsDate()
  toDate: Date;

  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  roomIds: [number];

  @IsNotEmpty()
  roomersQty: string;
}
