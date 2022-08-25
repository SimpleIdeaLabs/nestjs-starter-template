import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MyLoggerService } from '../../modules/my-logger/my-logger.service';
import { ConfigService } from '@nestjs/config';

/**
 * ApiLoggerInterceptor
 * Logs all incoming requests and
 * Logs all response for the request
 */
@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly myLoggerService: MyLoggerService,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const env = this.configService.get('env');
    const apiVersion = this.configService.get('apiVersion');
    const gitHead = this.configService.get('gitHead');
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    res.write = (chunk, ...args) => {
      chunks.push(chunk);
      return oldWrite.apply(res, [chunk, ...args]);
    };

    res.end = (chunk, ...args) => {
      if (chunk) {
        chunks.push(chunk);
      }

      // response data
      const body = Buffer.concat(chunks).toString('utf8');

      if (env !== 'TEST') {
        this.myLoggerService.apiLog(req.originalUrl, {
          request: {
            headers: req.headers,
            body: req.body,
            method: req.method,
            params: req.params,
            query: req.query,
            user: req.user,
            originalUrl: req.originalUrl,
          },
          response: {
            body: JSON.parse(body),
          },
          system: {
            apiVersion,
            gitHead,
          },
        });
      }
      return oldEnd.apply(res, [chunk, ...args]);
    };

    return next.handle();
  }
}
