import { Billing } from './entities/billing.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Billing)
export class BillingRepository extends Repository<Billing> {}
