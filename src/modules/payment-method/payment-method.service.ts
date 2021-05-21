import { PaymentMethodRepository } from './payment-method.repository';
import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const paymentMethod = new PaymentMethod(createPaymentMethodDto);
    paymentMethod.status = `active`;
    return await paymentMethod.save();
  }

  async findAll(): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({
      where: { status: `active` },
    });
  }

  async findOne(id: number): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findOne({ id });
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
