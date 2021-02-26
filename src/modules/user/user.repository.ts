import { Role } from './../role/role.entity';
import { RoleRepository } from './../role/role.repository';
import { SignupDto } from './../auth/dto/signup.dto';
import { EntityRepository, Repository, getConnection } from 'typeorm';
import { User } from './user.entity';
import { genSalt, hash } from 'bcryptjs';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from './user.details.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new User();

    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );
    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];

    const details = new UserDetails();
    user.details = details;

    const salt = await genSalt(10);
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Username already has been taken`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }
}
