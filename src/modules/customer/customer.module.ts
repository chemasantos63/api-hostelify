import { CustomerRepository } from './customer.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerTypesRepository } from './customer.types.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CustomerRepository, CustomerTypesRepository]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
