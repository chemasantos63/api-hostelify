import { CustomerModule } from './../customer/customer.module';
import { ProductModule } from './../product/product.module';
import { BalanceModule } from './../balance/balance.module';
import { RoomModule } from './../room/room.module';
import { AuthModule } from './../auth/auth.module';
import { PaymentModule } from './../payment/payment.module';
import { TotalModule } from './../total/total.module';
import { FiscalInformationModule } from './../fiscal-information/fiscal-information.module';
import { PermanenceModule } from './../permanence/permanence.module';
import { BillingRepository } from './billing.repository';
import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BillingRepository]),
    PermanenceModule,
    FiscalInformationModule,
    TotalModule,
    PaymentModule,
    RoomModule,
    BalanceModule,
    ProductModule,
    CustomerModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
