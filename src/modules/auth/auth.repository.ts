import { EntityRepository, Repository } from 'typeorm';
import { User } from '../user/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {}
