import { User } from './../user/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
