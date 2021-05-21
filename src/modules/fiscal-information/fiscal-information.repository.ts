import { FiscalInformation } from './entities/fiscal-information.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FiscalInformation)
export class FiscalInformationRepository extends Repository<FiscalInformation> {}
