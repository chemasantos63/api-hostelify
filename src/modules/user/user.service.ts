import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async get(id: number): Promise<User> {
    return await this.userRepository.findUserById(id);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAllActiveUsers();
  }

  async createUser(userDto: UserDto): Promise<User> {
    return await this.userRepository.createUser(userDto);
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.userRepository.inactivateUser(id);
  }
}
