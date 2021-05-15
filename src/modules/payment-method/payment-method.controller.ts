import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodService } from './payment-method.service';

@UseGuards(AuthGuard())
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    return await this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get()
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(+id, updatePaymentMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodService.remove(+id);
  }
}
