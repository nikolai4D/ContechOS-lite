import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isDateTime } from 'neo4j-driver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilities } from 'src/utilities/Utilities';

const KEYS_TO_EXCLUDE: string[] = ['password'];

const serialize = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  // Date must be returned as-is
  if (value instanceof Date) {
    return value;
  }

  if (isDateTime(value)) {
    return Utilities.neo4jDateTimeToDateObject(value).toISOString();
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !KEYS_TO_EXCLUDE.includes(key))
        .map(([key, value]) => [key, serialize(value)]),
    );
  }

  return value;
};

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(serialize));
  }
}
