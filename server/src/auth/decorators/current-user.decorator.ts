import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * @returns The authenticated user making the request.
 *
 * This is always guaranteed to be a User when the resolver
 * is decorated with the `@UseGuards(JwtAuthGuard)` decorator.
 * Otherwise this can return `null`.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
