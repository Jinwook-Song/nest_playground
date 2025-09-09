import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // GraphQL context에서 HTTP request 추출
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
