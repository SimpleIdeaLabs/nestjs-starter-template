import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-mongodb';
import {
  API_LOG_COLLECTION,
  APP_LOG_COLLECTION,
} from '../../config/my-logger.constants';
import { UtilService } from './util.service';

@Injectable()
export class MyLoggerService implements LoggerService {
  // app logger
  defaultLogger: winston.Logger;

  // api logger
  apiLogger: winston.Logger;

  // env
  env: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
  ) {
    const mongoDbTransports = winston.transports as any;
    this.env = this.configService.get('env');

    // initialize app logger
    this.defaultLogger = winston.createLogger({
      format: winston.format.simple(),
      transports: [
        new winston.transports.Console({
          format: winston.format.prettyPrint(),
        }),
        new mongoDbTransports['MongoDB']({
          db: this.configService.get<string>('mongodb'),
          collection: APP_LOG_COLLECTION,
          capped: false,
        }),
      ],
    });

    // initialize api logger
    this.apiLogger = winston.createLogger({
      format: winston.format.simple(),
      transports: [
        new winston.transports.Console({
          format: winston.format.prettyPrint(),
        }),
        new mongoDbTransports['MongoDB']({
          db: this.configService.get<string>('mongodb'),
          collection: API_LOG_COLLECTION,
          capped: false,
        }),
      ],
    });
  }

  /**
   * Wrote a 'log' level log for API Requests
   */
  apiLog(message: any, metadata: any) {
    if (this.env === 'TEST') return;
    this.apiLogger.info(message, {
      metadata,
    });
  }

  /**
   * Wrote a 'error' level log for API Requests
   */
  apiError(message: any, metadata: any) {
    if (this.env === 'TEST') return;
    this.apiLogger.error(message, { metadata });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, metadata?: any) {
    if (this.env === 'TEST') return;
    this.defaultLogger.info(message, {
      metadata: {
        requestId: this.utilService.getRequestId(),
        metadata,
      },
    });
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, metadata?: any) {
    if (this.env === 'TEST') return;
    this.defaultLogger.error(message, {
      metadata: {
        requestId: this.utilService.getRequestId(),
        metadata,
      },
    });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, metadata?: any) {
    if (this.env === 'TEST') return;
    this.defaultLogger.warn(message, {
      metadata: {
        requestId: this.utilService.getRequestId(),
        metadata,
      },
    });
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, metadata?: any) {
    if (this.env === 'TEST') return;
    this.defaultLogger.debug(message, {
      metadata: {
        requestId: this.utilService.getRequestId(),
        metadata,
      },
    });
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, metadata?: any) {
    if (this.env === 'TEST') return;
    this.defaultLogger.verbose(message, {
      metadata: {
        requestId: this.utilService.getRequestId(),
        metadata,
      },
    });
  }
}
