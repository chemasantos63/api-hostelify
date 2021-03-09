import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformClassToPlain } from 'class-transformer';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer-input';
import { UpdateCustomerDto } from './dto/update-customer-input';
import { Customer } from './entities/customer.entity';

@UseGuards(AuthGuard())
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @TransformClassToPlain()
  async getCustomers(): Promise<Customer[]> {
    const customers = await this.customerService.getAll();

    return customers;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const createdCustomer = await this.customerService.createCustomer(
      createCustomerDto,
    );
    return createdCustomer;
  }

  @Patch(`:id`)
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async updateCustomer(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<void> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
}
