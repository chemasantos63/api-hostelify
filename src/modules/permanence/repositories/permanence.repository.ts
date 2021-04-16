import { EntityRepository, Repository } from 'typeorm';
import { Permanence } from '../entities/permanence.entity';

@EntityRepository(Permanence)
export class PermanenceRepository extends Repository<Permanence> {}
