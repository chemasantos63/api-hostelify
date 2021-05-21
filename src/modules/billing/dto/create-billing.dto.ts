import { CreatePaymentDto } from './../../payment/dto/create-payment.dto';
import { IsNotEmpty } from 'class-validator';
export class CreateBillingDto {
  @IsNotEmpty()
  permanencesId: number[];
  @IsNotEmpty()
  payments: CreatePaymentDto[];
}
