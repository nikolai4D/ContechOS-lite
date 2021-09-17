import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Auth guard used to make sure that in order to access a
 * resolver there is a valid JWT token in the request's
 * `Authorization` header in the format `Bearer <TOKEN>`.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const { req } = ctx.getContext();

    /**
     * The body must contain only the query's or
     * mutation's variables in order to access them
     * directly from the body object and to also
     * make the automatic validation work.
     */
    req.body = req.body.variables;

    return req;
  }
}
