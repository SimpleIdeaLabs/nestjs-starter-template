import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-mongodb';
import { API_LOG_COLLECTION, APP_LOG_COLLECTION } from './my-logger.constants';

@Injectable()
export class MyLoggerService implements LoggerService {
  // app logger
  defaultLogger: winston.Logger;

  // api logger
  apiLogger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const mongoDbTransports = winston.transports as any;

    // initialise app logger
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

    // initialise api logger
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
    this.apiLogger.info(message, { metadata });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, metadata?: any) {
    this.defaultLogger.info(message, { metadata });
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, metadata: any) {
    this.defaultLogger.error(message, { metadata });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, metadata?: any) {
    this.defaultLogger.warn(message, { metadata });
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, metadata?: any) {
    this.defaultLogger.debug(message, { metadata });
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, metadata?: any) {
    this.defaultLogger.verbose(message, { metadata });
  }
}
