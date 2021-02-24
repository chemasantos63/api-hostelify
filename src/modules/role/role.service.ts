import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException(`Id must be sent`);
    }

    const role: Role = await this.roleRepository.findOne(id, {
      where: { status: `ACTIVE` },
    });

    if (!role) {
      throw new NotFoundException(`role does not exits`);
    }

    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this.roleRepository.find({
      where: { status: `ACTIVE` },
    });

    return roles;
  }

  async create(role: Role): Promise<Role> {
    const savedRole: Role = await this.roleRepository.save(role);

    return savedRole;
  }

  async update(id: number, role: Role): Promise<void> {
    await this.roleRepository.update(id, role);
  }

  async delete(id: number): Promise<void> {
    const roleExists: Role = await this.roleRepository.findOne(id, {
      where: { status: `ACTIVE` },
    });

    if (!roleExists) {
      throw new NotFoundException(`role does not exists`);
    }

    await this.roleRepository.update(id, { status: `INACTIVE` });
  }
}
