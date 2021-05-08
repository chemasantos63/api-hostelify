import { IsDate, IsNotEmpty } from 'class-validator';
import { CreateGuestDto } from '../../permanence/dto/create-guest.input';

export class CreateReservationDto {
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

  // guestDto: CreateGuestDto[];
}
