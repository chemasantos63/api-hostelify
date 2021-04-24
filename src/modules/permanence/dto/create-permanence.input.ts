import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateGuestDto } from './create-guest.input';

export class CreatePermanenceDto {
  @IsNumberString()
  idReservation: number;

  @IsNotEmpty()
  createGuestDto: CreateGuestDto[];
}
