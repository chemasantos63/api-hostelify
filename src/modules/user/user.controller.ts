import { User } from './user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller(`users`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(`:id`)
  async getUser(@Param(`id`, ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.get(id);
    return user;
  }

  @UseGuards(AuthGuard())
  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getAll();
    return users;
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const createdUser = await this.userService.createUser(user);
    return createdUser;
  }

  @Patch(`:id`)
  async updateUser(
    @Param(`id`, ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    const updatedUser = await this.userService.updateUser(id, user);
    return updatedUser;
  }

  @Delete(`:id`)
  async deleteUser(@Param(`id`, ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return true;
  }
}
