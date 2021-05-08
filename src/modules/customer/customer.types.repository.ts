import { CustomerType } from './entities/customer.types.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {}
