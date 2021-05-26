import { BillingRepository } from './billing.repository';
import { Payment } from './../payment/entities/payment.entity';
import { PaymentService } from './../payment/payment.service';
import { TotalService } from './../total/total.service';
import { PermanenceService } from './../permanence/services/permanence.service';
import { Billing } from './entities/billing.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { FiscalInformationService } from '../fiscal-information/fiscal-information.service';
import { Connection, EntityManager } from 'typeorm';
import { query } from 'express';
import { FiscalInformation } from '../fiscal-information/entities/fiscal-information.entity';
import { Total } from '../total/entities/total.entity';
import { Permanence } from '../permanence/entities/permanence.entity';
import { User } from '../user/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as utils from 'util';
import * as hb from 'handlebars';
import { launch } from 'puppeteer';

@Injectable()
export class BillingService {
  private readFile = utils.promisify(fs.readFile);

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
    const { manager } = queryRunner;

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

      const invoice: Billing = this.initBill(fiscalInformation);

      await this.findPermanencesByDto(createBillingDto, invoice);

      await this.createBillingTotals(invoice, manager);

      this.validatePaymentsTotal(createBillingDto, invoice.total);

      await this.createBillingPayments(createBillingDto, manager, invoice);

      this.logger.verbose(`Invoice Object: ${JSON.stringify(invoice)}`);

      await manager.save(invoice);

      await this.updateCurrentNumberAndRangeFiscalInformation(
        fiscalInformation,
        manager,
      );

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

  private initBill(fiscalInformation: FiscalInformation) {
    const invoice: Billing = new Billing({
      fiscalInformation,
      cai: fiscalInformation.cai,
      invoiceNumber: fiscalInformation.currentNumber,
    });

    invoice.permanences = [];
    invoice.payments = [];
    return invoice;
  }

  private async findPermanencesByDto(
    createBillingDto: CreateBillingDto,
    invoice: Billing,
  ) {
    for (const permanenceId of createBillingDto.permanencesId) {
      const permanence = await this.permanenceService.get(permanenceId);
      this.validatePermanence(invoice, permanence);
      invoice.permanences = [...invoice.permanences, permanence];
    }
  }

  private validatePermanence(invoice: Billing, permanence: Permanence) {
    this.validateCustomerFromPermanence(invoice, permanence);
    this.validatePermanenceAlreadyInvoiced(permanence);
  }

  private validatePermanenceAlreadyInvoiced(permanence: Permanence) {
    if (permanence.invoice) {
      throw new ConflictException(
        `La permanencia ${permanence.id} ya cuenta con una factura.`,
      );
    }
  }

  private validateCustomerFromPermanence(
    invoice: Billing,
    permanence: Permanence,
  ) {
    if (invoice.permanences.filter((p) => p.id !== permanence.id).length > 0) {
      throw new ConflictException(
        `Las permanencias deben de pertenecer el mismo cliente.`,
      );
    }
  }

  private async createBillingTotals(
    invoice?: Billing,
    manager?: EntityManager,
  ) {
    const total = await this.totalService.create(
      {
        permanences: invoice.permanences,
      },
      manager,
    );

    invoice.total = total;
    return total;
  }

  private validatePaymentsTotal(
    createBillingDto: CreateBillingDto,
    total: Total,
  ) {
    const paymentsTotal = createBillingDto.payments.reduce(
      (acc, act) => acc + +act.amount,
      0,
    );

    if (total.total > paymentsTotal) {
      throw new ConflictException(
        `La cantidad de pagos no coincide con al cantidad total de la factura. Total factura: ${total.total} - Total pagos: ${paymentsTotal}.`,
      );
    }
  }

  private async createBillingPayments(
    createBillingDto: CreateBillingDto,
    manager,
    invoice: Billing,
  ) {
    for (const paymentDto of createBillingDto.payments) {
      const payment = await this.paymentService.create(paymentDto, manager);

      invoice.payments = [...invoice.payments, payment];
    }
  }

  private async updateCurrentNumberAndRangeFiscalInformation(
    fiscalInformation: FiscalInformation,
    manager,
  ) {
    fiscalInformation.currentNumber += 1;
    fiscalInformation.range -= 1;

    await manager.save(fiscalInformation);
  }

  async findAll(): Promise<Billing[]> {
    const billings = this.billingRepository
      .createQueryBuilder(`invoice`)
      .innerJoinAndSelect(`invoice.permanences`, `permanences`)
      .innerJoinAndSelect(`invoice.total`, `total`)
      .innerJoinAndSelect(`invoice.payments`, `payments`)
      .innerJoinAndSelect(`invoice.fiscalInformation`, `fiscalInformation`)
      .innerJoinAndSelect(`permanences.reservation`, `reservation`)
      .innerJoinAndSelect(`reservation.rooms`, `rooms`)
      .innerJoinAndSelect(`reservation.customer`, `customer`)
      .getMany();

    return await billings;
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

  async createInvoicePdf(user: User, id: number): Promise<Buffer> {
    const invoice = await this.billingRepository.findOne({ id });

    if (!invoice) {
      throw new NotFoundException('La factura no existe');
    }

    await this.generatePdf({
      id: invoice.id,
      invoiceTitle: `Esta es la primera factura de prueba`,
    });

    const filePath = `${path.join(__dirname, `..`, `..`, `public`)}/invoice_${
      invoice.id
    }.pdf`;

    const pdf = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, {}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return pdf;
  }

  private async getTemplateHtml(): Promise<string> {
    this.logger.verbose(`Loading template file in memory`);

    try {
      const invoiceTemplatePath = path.resolve(
        `${path.join(__dirname, `..`, `..`, `templates`)}/invoice.hbs`,
      );
      return await this.readFile(invoiceTemplatePath, `utf-8`);
    } catch (e) {
      return Promise.reject(`Could not load html template`);
    }
  }

  private async generatePdf(data: any) {
    try {
      const htmlTemplate = await this.getTemplateHtml();

      this.logger.verbose(`Compiling the template with handlebars`);

      const template = hb.compile(htmlTemplate, { strict: true });

      const result = template(data);

      const browser = await launch();
      const page = await browser.newPage();

      await page.setContent(result);

      const pathToSavePdf = path.resolve(
        `${path.join(__dirname, `..`, `..`, `public`)}/invoice_${data.id}.pdf`,
      );

      await page.pdf({
        path: pathToSavePdf,
        printBackground: true,
        width: `8cm`,
      });

      await browser.close();

      this.logger.verbose(`PDF Generated`);
    } catch (e) {
      this.logger.error(`An Error has ocurred generating PDF`, e.stack);
      throw e;
    }
  }
}
