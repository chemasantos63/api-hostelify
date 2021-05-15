import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsNumber()
  exchangeRate: number;
}
