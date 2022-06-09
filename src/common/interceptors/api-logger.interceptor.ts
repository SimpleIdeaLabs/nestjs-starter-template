import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MyLoggerService } from '../modules/my-logger/my-logger.service';
import { tap } from 'rxjs/operators';

/**
 * ApiLoggerInterceptor
 * Logs all incoming requests and
 * Logs all response for the request
 */
@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  constructor(private readonly myLoggerService: MyLoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const {
      originalUrl = '',
      method = '',
      params = {},
      query = {},
      body = {},
      headers = {},
    } = req;

    return next.handle().pipe(
      tap((data) => {
        // request data
        const request = {
          originalUrl,
          method,
          params,
          query,
          body,
          headers,
        };

        if (statusCode === HttpStatus.FORBIDDEN) {
          data = null;
        }

        // response data
        const response = {
          statusCode,
          data,
        };

        // log
        this.myLoggerService.apiLog(originalUrl, {
          request,
          response,
        });
      }),
    );
  }
}
