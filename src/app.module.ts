import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { CustomerModule } from './modules/customer/customer.module';
import { RoomModule } from './modules/room/room.module';
import { RoomerModule } from './modules/roomer/roomer.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermanenceModule } from './modules/permanence/permanence.module';
import { BillingModule } from './modules/billing/billing.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TotalModule } from './modules/total/total.module';
import { FiscalInformationModule } from './modules/fiscal-information/fiscal-information.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    RoleModule,
    CustomerModule,
    RoomModule,
    RoomerModule,
    ReservationModule,
    AuthModule,
    PermanenceModule,
    BillingModule,
    PaymentModule,
    PaymentMethodModule,
    TotalModule,
    FiscalInformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get(Configuration.PORT);
  }
}
