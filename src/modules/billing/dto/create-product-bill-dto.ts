import { CreatePaymentDto } from './../../payment/dto/create-payment.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductsToBillDto } from './product-to-bill.dto';
export class CreateProductBillDto {
  @IsNotEmpty()
  products: ProductsToBillDto[];
  @IsNotEmpty()
  payments: CreatePaymentDto[];
  @IsNotEmpty()
  @IsString()
  condition: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;
}
