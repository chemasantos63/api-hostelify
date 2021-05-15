import { PaymentMethodRepository } from './payment-method.repository';
import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PaymentMethodRepository])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
