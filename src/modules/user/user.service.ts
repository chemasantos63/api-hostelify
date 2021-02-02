import { MapperService } from './../../shared/mapper.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException(`Id must be sent`);
    }

    const user: User = await this.userRepository.findOne(id, {
      where: { status: `ACTIVE` },
    });

    if (!user) {
      throw new NotFoundException(`User does not exits`);
    }

    return this.mapperService.map<User, UserDto>(user, new UserDto());
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      where: { status: `ACTIVE` },
    });

    return users;
  }

  async createUser(user: User): Promise<User> {
    user.details = new UserDetails();

    const repo = getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { name: `GENERAL` } });
    user.roles = [defaultRole];

    const savedUser: User = await this.userRepository.save(user);

    return savedUser;
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    const userExists: User = await this.userRepository.findOne(id, {
      where: { status: `ACTIVE` },
    });

    if (!userExists) {
      throw new NotFoundException(`User does not exists`);
    }

    await this.userRepository.update(id, { status: `INACTIVE` });
  }
}
