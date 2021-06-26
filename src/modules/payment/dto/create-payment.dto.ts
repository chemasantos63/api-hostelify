import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  paymentMethodId: number;
  @IsNumber()
  amount: number;
  @IsNumber()
  balance_id: number;
}
