import { PaymentRepository } from './payment.repository';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment(createPaymentDto);
    return await payment.save();
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({});
    return payments;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
