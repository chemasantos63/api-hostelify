import { CustomerType } from './entities/customer.types.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CustomerType)
export class CustomerTypesRepository extends Repository<CustomerType> {}
