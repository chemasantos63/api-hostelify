export class InvoiceBillingDTO {
  invoiceCondition: string;
  invoiceNumber: string;
  invoiceDateAndTime: string;
  customerName: string;
  customerCode: string;
  customerIdentification: string;
  invoiceCai: string;
  fiscalInformationDateValidTo: string;
  fiscalInformationRange: string;
  invoiceDetail: InvoiceBillingDetailDTO[];
  invoiceSubTotal: string;
  invoiceExentAmount: string;
  invoiceExoneratedAmount: string;
  invoiceTaxableAmount15: string;
  invoiceTaxableAmount18: string;
  invoiceTaxAmount15: string;
  invoiceTaxAmount18: string;
  invoiceTaxAmount4: string;
  invoiceTotal: string;
  totalWrittenValue: string;
  payments: PaymentBillingDTO[];
}

export class InvoiceBillingDetailDTO {
  quantity: number;
  roomDescription: string;
  roomersQuantity: string;
  unitPrice: string;
  discount: string;
  total: string;
}

export class PaymentBillingDTO {
  paymentDescription: string;
  paymentAmount: string;
}
