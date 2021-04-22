import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateGuestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  identification: string;

  @IsNotEmpty()
  nationality: string;

  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  destination: string;

  occupation: string;

  phone: string;
}
