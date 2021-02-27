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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { TransformClassToPlain } from 'class-transformer';

@UseGuards(AuthGuard())
@Controller(`users`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(`:id`)
  @TransformClassToPlain()
  async getUser(@Param(`id`, ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.get(id);
    return user;
  }

  @Get()
  @TransformClassToPlain()
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getAll();
    return users;
  }

  @Post()
  @TransformClassToPlain()
  @UsePipes(ValidationPipe)
  async createUser(@Body() userDto: UserDto): Promise<User> {
    const createdUser = await this.userService.createUser(userDto);
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
