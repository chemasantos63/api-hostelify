import { RoomService } from './../room/services/room.service';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { InvoicePaymentDetail } from './entities/invoice-payment-detail.entity';
import { Invoice } from './entities/invoice.entity';
import {
  InvoiceBillingDetailDTO,
  InvoiceBillingDTO,
} from './dto/invoiceBillingDTO';
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
import * as writtenNumber from 'written-number';
import * as dayjs from 'dayjs';
import { launch } from 'puppeteer';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Room } from '../room/entities/room.entity';

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
    private readonly roomService: RoomService,
  ) {
    writtenNumber.defaults.lang = 'es';
  }

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

      invoice.condition = createBillingDto.condition;

      await this.findPermanencesByDto(createBillingDto, invoice);

      await this.createBillingTotals(invoice, manager);

      this.validatePaymentsTotal(createBillingDto, invoice.total);

      await this.createBillingPayments(createBillingDto, manager, invoice);

      const invoiceReport = this.parseInvoiceDataToReport(invoice);

      invoiceReport.detail = await manager.save(invoiceReport.detail);
      invoiceReport.payments = await manager.save(invoiceReport.payments);

      invoice.invoiceReport = await manager.save(invoiceReport);

      for (const permanence of invoice.permanences) {
        for (const room of permanence.reservation.rooms) {
          await this.roomService.setRoomStatus(room, `Sucia`, manager);
        }
      }

      await manager.save(invoice);

      this.logger.verbose(`Invoice Object: ${JSON.stringify(invoice)}`);

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

  async findOne(id: number): Promise<Billing> {
    return await this.billingRepository.findOne({ id });
  }

  update(id: number, updateBillingDto: UpdateBillingDto) {
    return `This action updates a #${id} billing`;
  }

  remove(id: number) {
    return `This action removes a #${id} billing`;
  }

  async createInvoicePdf(user: User, id: number): Promise<Buffer> {
    const invoice = await this.findOne(id);

    if (!invoice) {
      throw new NotFoundException('La factura no existe');
    }

    this.logger.debug(JSON.stringify(invoice));

    await this.generatePdf(invoice.invoiceReport);

    const filePath = `${path.join(__dirname, `..`, `..`, `public`)}/invoice_${
      invoice.invoiceReport.invoiceNumber
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

  private getInvoiceReportDetail(
    invoice: Billing,
    permanenceReservation: Reservation,
  ): Partial<InvoiceDetail>[] {
    return invoice.permanences[0].reservation.rooms.map((r) => {
      const unitPrice = this.getUnitPriceFromReservation(
        r,
        permanenceReservation,
      ).toFixed(1);

      const roomDetail: Partial<InvoiceDetail> = {
        quantity: `1`,
        description: `Habitacion ${r.type.type}`,
        roomersQuantity: `Huespedes ${permanenceReservation.roomersQty}`,
        unitPrice: Number(unitPrice).toFixed(2),
        discount: `0.00`,
        total: Number(unitPrice).toFixed(2),
      };

      return roomDetail;
    });
  }

  private getUnitPriceFromReservation(
    r: Room,
    permanenceReservation: Reservation,
  ): number {
    return +r.type.roomTypesDetail.filter(
      (rt) => rt.roomersQuantity === +permanenceReservation.roomersQty,
    )[0].price;
  }

  private buildPaymentsDescription(
    invoice: Billing,
  ): Partial<InvoicePaymentDetail>[] {
    return invoice.payments.map((p) => ({
      paymentDescription:
        p.amount < 0 ? `SU CAMBIO ES` : p.paymentMethod.description,
      paymentAmount: Math.abs(p.amount).toString(),
    }));
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

  private async generatePdf(data: Invoice) {
    try {
      const htmlTemplate = await this.getTemplateHtml();

      this.logger.verbose(`Compiling the template with handlebars`);

      const template = hb.compile(htmlTemplate, { strict: true });

      const result = template(data);

      const browser = await launch();
      const page = await browser.newPage();

      await page.setContent(result);

      const pathToSavePdf = path.resolve(
        `${path.join(__dirname, `..`, `..`, `public`)}/invoice_${
          data.invoiceNumber
        }.pdf`,
      );
      // await page.emulateMediaType('screen');
      await page.pdf({
        path: pathToSavePdf,
        printBackground: true,
        width: `72.1mm`,
        scale: 1,
        margin: {
          left: `0mm`,
          right: `2mm`,
        },
      });

      await browser.close();

      this.logger.verbose(`PDF Generated`);
    } catch (e) {
      this.logger.error(`An Error has ocurred generating PDF`, e.stack);
      throw e;
    }
  }

  private parseInvoiceDataToReport(invoice: Billing): Invoice {
    const invoiceReport = new Invoice({
      customerCode: this.padCustomerCodeWithZeros(invoice),
      customerIdentification: invoice.permanences[0].customer.documentNumber,
      customerName: this.getCustomerNameFromInvoice(invoice),
      invoiceCai: invoice.fiscalInformation.cai,
      invoiceCondition: invoice.condition,
      invoiceDateAndTime: dayjs(invoice.createdAt).format(
        'DD/MM/YYYY hh:mm:ss a',
      ),
      invoiceNumber: this.getInvoiceNumberWithCai(
        invoice.fiscalInformation.prefix,
        invoice.invoiceNumber,
      ),
      invoiceSubtotal: Number(invoice.total.subtotal).toFixed(2),
      invoiceTaxableAmount15: Number(invoice.total.taxedAmount).toFixed(2),
      invoiceTaxableAmount18: `0.00`,
      invoiceTaxAmount15: Number(invoice.total.tax15Amount).toFixed(2),
      invoiceTaxAmount18: `0. 00`,
      invoiceTaxAmount4: Number(invoice.total.tourismTax).toFixed(2),
      invoiceExentAmount: `0.00`,
      invoiceExoneratedAmount: `0.00`,
      invoiceTotal: Number(invoice.total.total).toFixed(2),
      fiscalInformationDateValidTo: invoice.fiscalInformation.dateValidTo.toString(),
      fiscalInformationRange: this.getRangeCaiInvoiceNumber(invoice),
      totalWrittenValue: this.parseNumberToWords(invoice.total.total),
    });

    invoiceReport.payments = [];
    invoiceReport.detail = [];

    const paymentsDetails = this.buildPaymentsDescription(invoice);

    paymentsDetails.forEach((p) => {
      invoiceReport.payments = [
        ...invoiceReport.payments,
        new InvoicePaymentDetail(p),
      ];
    });

    const invoiceDetail = this.getInvoiceReportDetail(
      invoice,
      invoice.permanences[0].reservation,
    );

    invoiceDetail.forEach((d) => {
      invoiceReport.detail = [...invoiceReport.detail, new InvoiceDetail(d)];
    });

    return invoiceReport;
  }

  private parseNumberToWords(num: number): string {
    let parsedNumber = '';

    const intPart = Math.trunc(num);
    const floatPart = Number((num - intPart).toFixed(2));

    parsedNumber = writtenNumber(num);

    return `${parsedNumber} LEMPIRAS CON ${this.zfill(
      floatPart * 100,
      2,
    )}/100 CENTAVOS`.toUpperCase();
  }

  private zfill(numberToFill: number, width: number) {
    const numberOutput = Math.abs(numberToFill);
    const length = numberToFill.toString().length;
    const zero = '0';

    if (width <= length) {
      if (numberToFill < 0) {
        return '-' + numberOutput.toString();
      } else {
        return numberOutput.toString();
      }
    } else {
      if (numberToFill < 0) {
        return '-' + zero.repeat(width - length) + numberOutput.toString();
      } else {
        return zero.repeat(width - length) + numberOutput.toString();
      }
    }
  }

  private getRangeCaiInvoiceNumber(invoice: Billing): string {
    return `${this.getInvoiceNumberWithCai(
      invoice.fiscalInformation.prefix,
      invoice.fiscalInformation.begin,
    )} - ${this.getInvoiceNumberWithCai(
      invoice.fiscalInformation.prefix,
      invoice.fiscalInformation.end,
    )}`;
  }

  private getInvoiceNumberWithCai(
    caiPrefix: string,
    invoiceNumber: number,
  ): string {
    return `${caiPrefix}${invoiceNumber.toString().padStart(8, `0`)}`;
  }

  private getCustomerNameFromInvoice(invoice: Billing): string {
    return `${invoice.permanences[0].customer.name} ${invoice.permanences[0].customer.lastname}`;
  }

  private padCustomerCodeWithZeros(invoice: Billing): string {
    return invoice.permanences[0].reservation.customer.id
      .toFixed(0)
      .padStart(6, `0`);
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
}
