import { PaymentMethod } from './entities/payment-method.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PaymentMethod)
export class PaymentMethodRepository extends Repository<PaymentMethod> {}
