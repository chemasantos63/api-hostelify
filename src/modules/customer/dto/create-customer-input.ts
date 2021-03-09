import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsNumber()
  customerTypeId: number;
}
