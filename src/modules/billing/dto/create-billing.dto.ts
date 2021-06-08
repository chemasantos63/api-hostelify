import { CreatePaymentDto } from './../../payment/dto/create-payment.dto';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateBillingDto {
  @IsNotEmpty()
  permanencesId: number[];
  @IsNotEmpty()
  payments: CreatePaymentDto[];
  @IsNotEmpty()
  @IsString()
  condition: string;
}
