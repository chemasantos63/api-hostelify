import { BillingRepository } from './billing.repository';
import { Payment } from './../payment/entities/payment.entity';
import { PaymentService } from './../payment/payment.service';
import { TotalService } from './../total/total.service';
import { PermanenceService } from './../permanence/services/permanence.service';
import { Billing } from './entities/billing.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { FiscalInformationService } from '../fiscal-information/fiscal-information.service';
import { Connection } from 'typeorm';
import { query } from 'express';

@Injectable()
export class BillingService {
  private logger = new Logger(`BillingService`);

  constructor(
    private readonly permanenceService: PermanenceService,
    private readonly fiscalInformationService: FiscalInformationService,
    private readonly totalService: TotalService,
    private readonly paymentService: PaymentService,
    private readonly connection: Connection,
    private readonly billingRepository: BillingRepository,
  ) {}

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.verbose(
        `creating invoice for permanences ids ${JSON.stringify(
          createBillingDto.permanencesId,
        )} with this DTO: ${JSON.stringify(createBillingDto)}`,
      );

      const fiscalInformation = await this.fiscalInformationService.findOneActive();

      this.logger.verbose(
        `Found fiscal information: ${JSON.stringify(fiscalInformation)}`,
      );

      const invoice: Billing = new Billing({
        fiscalInformation,
        cai: fiscalInformation.cai,
        invoiceNumber: fiscalInformation.currentNumber,
      });

      //  `${fiscalInformation.prefix}${String(
      //   fiscalInformation.currentNumber,
      //   ).padStart(8, '0')}`

      invoice.permanences = [];
      invoice.payments = [];

      this.logger.verbose(`Invoice Object: ${JSON.stringify(invoice)}`);

      for (const permanenceId of createBillingDto.permanencesId) {
        invoice.permanences = [
          ...invoice.permanences,
          await this.permanenceService.get(permanenceId),
        ];
      }

      const total = await this.totalService.create({
        permanences: invoice.permanences,
      });

      await queryRunner.manager.save(total);

      for (const payment of createBillingDto.payments) {
        const paymentToCreate = await this.paymentService.create(payment);

        await queryRunner.manager.save(paymentToCreate);

        invoice.payments = [...invoice.payments, paymentToCreate];
      }

      invoice.total = total;

      await queryRunner.manager.save(invoice);

      await queryRunner.commitTransaction();

      return invoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `An error has ocurred trying to create invoice`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Billing[]> {
    const billings = await this.billingRepository
      .createQueryBuilder(`invoice`)
      .innerJoinAndSelect(`invoice.permanences`, `permanences`)
      .innerJoinAndSelect(`invoice.total`, `total`)
      .innerJoinAndSelect(`invoice.payments`, `payments`)
      .innerJoinAndSelect(`invoice.fiscalInformation`, `fiscalInformation`)
      .innerJoinAndSelect(`permanences.reservation`, `reservation`)
      .innerJoinAndSelect(`reservation.rooms`, `rooms`)
      .innerJoinAndSelect(`reservation.customer`, `customer`)
      .getMany();
    return billings;
  }

  findOne(id: number) {
    return `This action returns a #${id} billing`;
  }

  update(id: number, updateBillingDto: UpdateBillingDto) {
    return `This action updates a #${id} billing`;
  }

  remove(id: number) {
    return `This action removes a #${id} billing`;
  }
}
