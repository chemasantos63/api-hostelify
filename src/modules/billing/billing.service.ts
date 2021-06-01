import {
  InvoiceBillingDetailDTO,
  InvoiceBillingDTO,
} from './invoiceBillingDTO';
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
    const invoice = await this.billingRepository
      .createQueryBuilder(`invoice`)
      .innerJoinAndSelect(`invoice.permanences`, `permanences`)
      .innerJoinAndSelect(`invoice.total`, `total`)
      .innerJoinAndSelect(`invoice.payments`, `payments`)
      .innerJoinAndSelect(`invoice.fiscalInformation`, `fiscalInformation`)
      .innerJoinAndSelect(`permanences.reservation`, `reservation`)
      .innerJoinAndSelect(`reservation.rooms`, `rooms`)
      .innerJoinAndSelect(`rooms.type`, `roomTypes`)
      .innerJoinAndSelect(`roomTypes.roomTypesDetail`,`roomTypeDetails`)
      .innerJoinAndSelect(`reservation.customer`, `customer`)
      .innerJoinAndSelect(`payments.paymentMethod`, `paymentMethods`)
      .where(`invoice.id = ${id}`)
      .getOne();

    // const invoice = await this.billingRepository.findOne({ id });

    this.logger.debug(JSON.stringify(invoice));

    if (!invoice) {
      throw new NotFoundException('La factura no existe');
    }

    const invoicePermanence = invoice.permanences[0];
    const permanenceReservation = invoicePermanence.reservation;
    const reservationRooms = permanenceReservation.rooms;

    const invoicePrintDTO: InvoiceBillingDTO = {
      customerCode: `${permanenceReservation.customer.id}`.padStart(6, `0`),
      customerIdentification: `${permanenceReservation.customer.documentNumber}`,
      customerName: `${permanenceReservation.customer.name} ${permanenceReservation.customer.lastname}`,
      invoiceCai: `${invoice.cai}`,
      invoiceCondition: `CONTADO`,
      invoiceDateAndTime: `${invoice.createdAt}`,
      invoiceNumber: `${
        invoice.fiscalInformation.prefix
      }-${invoice.invoiceNumber.toString().padStart(8, `0`)}`,
      invoiceSubTotal: invoice.total.subtotal.toString(),
      invoiceTaxableAmount15: invoice.total.taxedAmount.toString(),
      invoiceTaxAmount15: invoice.total.tax15Amount.toString(),
      invoiceTaxableAmount18: `0.00`,
      invoiceTaxAmount18: `0.00`,
      invoiceTaxAmount4: invoice.total.tourismTax.toString(),
      invoiceExentAmount: `0.00`,
      invoiceExoneratedAmount: `0.00`,
      invoiceTotal: invoice.total.total.toString(),
      payments: [
        ...invoice.payments.map((p) => ({
          paymentDescription:
            p.amount < 0 ? `SU CAMBIO ES` : p.paymentMethod.description,
          paymentAmount: p.amount.toString(),
        })),
      ],
      invoiceDetail: invoice.permanences[0].reservation.rooms.map((r) => {
        const roomDetail: InvoiceBillingDetailDTO = {
          quantity: 1,
          roomDescription: r.type.type,
          roomersQuantity: permanenceReservation.roomersQty,
          unitPrice: r.type.roomTypesDetail
            .filter(
              (rt) => rt.roomersQuantity === +permanenceReservation.roomersQty,
            )[0]
            .price.toFixed(0),
          discount: `0.00`,
          total: r.type.roomTypesDetail
            .filter(
              (rt) => rt.roomersQuantity === +permanenceReservation.roomersQty,
            )[0]
            .price.toFixed(0),
        };

        return roomDetail;
      }),
      fiscalInformationDateValidTo: invoice.fiscalInformation.dateValidTo.toString(),
      fiscalInformationRange: `${invoice.fiscalInformation.begin} -${invoice.fiscalInformation.end}`,
      totalWrittenValue: `Esto es una prueba`,
    };

    await this.generatePdf(invoicePrintDTO);

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

  private async generatePdf(data: InvoiceBillingDTO) {
    try {
      const htmlTemplate = await this.getTemplateHtml();

      this.logger.verbose(`Compiling the template with handlebars`);

      const template = hb.compile(htmlTemplate, { strict: true });

      const result = template({
        invoiceCondition: `CONTADO`,
        invoiceNumber: `001-001-01-00000001`,
        invoiceDateAndTime: `27/05/202 13:38:00 PM`,
        customerName: `Tony Alberto Stark Santos`,
        customerCode: `00001`,
        customerIdentification: `1401-1991-00501`,
        invoiceCai: `FA53C4-E30E05-8A4FA0-DED878-39345D-5C`,
        fiscalInformationDateValidTo: `01/01/2021`,
        fiscalInformationRange: `001-001-01-00000001 - 001-001-01-99999999`,
        invoiceDetail: [
          {
            quantity: 1,
            roomDescription: `Habitacion Familiar`,
            roomersQuantity: `2 Huespedes`,
            unitPrice: `903.00`,
            discount: `0.00`,
            total: `903.00`,
          },
          {
            quantity: 1,
            roomDescription: `Habitacion Familiar`,
            roomersQuantity: `2 Huespedes`,
            unitPrice: `903.00`,
            discount: `0.00`,
            total: `903.00`,
          },
          {
            quantity: 1,
            roomDescription: `Habitacion Familiar`,
            roomersQuantity: `2 Huespedes`,
            unitPrice: `903.00`,
            discount: `0.00`,
            total: `903.00`,
          },
          {
            quantity: 1,
            roomDescription: `Habitacion Familiar`,
            roomersQuantity: `2 Huespedes`,
            unitPrice: `903.00`,
            discount: `0.00`,
            total: `903.00`,
          },
        ],
        invoiceSubTotal: `1806.72`,
        invoiceExentAmount: `0.00`,
        invoiceExoneratedAmount: `0.00`,
        invoiceTaxableAmount15: `1806.72`,
        invoiceTaxableAmount18: `0.00`,
        invoiceTaxAmount15: `271.01`,
        invoiceTaxAmount18: `0.00`,
        invoiceTaxAmount4: `72.27`,
        invoiceTotal: `2150.00`,
        totalWrittenValue: `Dos Mil Ciento Cicuenta y Uno Exactos`,
        payments: [
          { paymentDescription: `EFECTIVO`, paymentAmount: `2200.00` },
          { paymentDescription: `SU CAMBIO ES`, paymentAmount: `50.00` },
        ],
      });

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
}
