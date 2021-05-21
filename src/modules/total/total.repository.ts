import { Total } from './entities/total.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Total)
export class TotalRepository extends Repository<Total> {}
