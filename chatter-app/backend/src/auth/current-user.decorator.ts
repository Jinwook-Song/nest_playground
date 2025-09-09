import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

const getCurrentUser = (ctx: ExecutionContext): User =>
  ctx.switchToHttp().getRequest().user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => getCurrentUser(ctx),
);
