import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateBalanceDto } from './create-balance.dto';

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {
  @IsNumber()
  cashTotal: number;

  @IsNumber()
  cardTotal: number;
}
