import { BalanceModule } from './../balance/balance.module';
import { PaymentMethodModule } from './../payment-method/payment-method.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PaymentRepository]),
    PaymentMethodModule,
    BalanceModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
