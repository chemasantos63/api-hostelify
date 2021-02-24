import { Role } from './role.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';

@Controller(`roles`)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(`:id`)
  async getRole(@Param(`id`, ParseIntPipe) id: number): Promise<Role> {
    const role = await this.roleService.get(id);
    return role;
  }

  @Get()
  async getRoles(): Promise<Role[]> {
    const roles = await this.roleService.getAll();
    return roles;
  }

  @Post()
  async createRole(@Body() role: Role): Promise<Role> {
    const createdRole = await this.roleService.create(role);
    return createdRole;
  }

  @Patch(`:id`)
  async updateRole(
    @Param(`id`, ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<boolean> {
    await this.roleService.update(id, role);
    return true;
  }

  @Delete(`:id`)
  async deleteRole(@Param(`id`, ParseIntPipe) id: number): Promise<boolean> {
    await this.roleService.delete(id);
    return true;
  }
}
