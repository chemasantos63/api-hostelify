import { CustomerTypesRepository } from './customer.types.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CustomerType } from './entities/customer.types.entity';
import { CreateCustomerDto } from './dto/create-customer-input';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer-input';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerTypesRepository: CustomerTypesRepository,
  ) {}

  async getAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async get(id: number): Promise<Customer> {
    return await this.customerRepository.findOneOrFail(id);
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const {
      name,
      lastname,
      customerTypeId,
      email,
      phone,
      documentNumber,
    } = createCustomerDto;
    const customer = new Customer();

    customer.name = name;
    customer.lastname = lastname;
    customer.phone = phone;
    customer.email = email;
    customer.documentNumber = documentNumber;
    customer.type = await this.customerTypesRepository.findOne({
      id: customerTypeId,
    });

    return await customer.save();
  }

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    const {
      name,
      lastname,
      documentNumber,
      email,
      phone,
      customerTypeId,
    } = updateCustomerDto;

    const customerType = await this.customerTypesRepository.findOne(
      customerTypeId,
    );

    if (!customerType) {
      throw new NotFoundException(`Customer Type does not exists`);
    }

    const customer = await this.get(id);

    if (!customer) {
      throw new NotFoundException(`Customer does not exists`);
    }

    customer.name = name;
    customer.lastname = lastname;
    customer.email = email;
    customer.documentNumber = documentNumber;
    customer.phone = phone;
    customer.type = customerType;

    await this.customerRepository.update(id, customer);
  }
}
