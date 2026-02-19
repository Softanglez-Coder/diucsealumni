import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { ApiResponse } from '@csediualumni/types';

/**
 * Wraps all successful responses in the standard API envelope: { data: ... }.
 * Responses that are already wrapped (contain a `data` key with a `meta` sibling)
 * are passed through unchanged to avoid double-wrapping paginated responses.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((value) => {
        // Already wrapped (paginated responses return { data, meta })
        if (value !== null && typeof value === 'object' && 'data' in (value as object)) {
          return value as unknown as ApiResponse<T>;
        }
        return { data: value };
      }),
    );
  }
}
