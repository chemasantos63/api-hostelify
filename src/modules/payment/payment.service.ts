import { Balance } from './../balance/entities/balance.entity';
import { BalanceService } from './../balance/balance.service';
import { BalanceRepository } from './../balance/balance.repository';
import { PaymentMethodService } from './../payment-method/payment-method.service';
import { PaymentRepository } from './payment.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { EntityManager } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentService {
  private logger = new Logger(`PaymentService`);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly balanceService: BalanceService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    balance?: Balance,
    manager?: EntityManager,
  ): Promise<Payment> {
    this.logger.verbose(
      `Creating payment with DTO:${JSON.stringify(createPaymentDto)}`,
    );
    const payment = new Payment(createPaymentDto);

    const paymentMethod = await this.paymentMethodService.findOne(
      createPaymentDto.paymentMethodId,
    );

    if (!paymentMethod) {
      throw new NotFoundException(
        `No se encontro el metodo de pago seleccionado.`,
      );
    }

    payment.paymentMethod = paymentMethod;

    if (balance) {
      payment.balance = balance;
    }

    return manager ? await manager.save(payment) : await payment.save();
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
