import { PaymentMethodService } from './../payment-method/payment-method.service';
import { PaymentRepository } from './payment.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentService {
  private logger = new Logger(`PaymentService`);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
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
