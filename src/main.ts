import { ConfigService } from '@nestjs/config';
import { getAppInstance } from './app.module';
import { ApiLoggerInterceptor } from './common/interceptors/api-logger.interceptor';
import { DatabaseService } from './modules/database/database.service';
import { MyLoggerService } from './modules/my-logger/my-logger.service';

async function bootstrap() {
  const app = await getAppInstance();
  const configService = app.get(ConfigService);
  const myLoggerService = app.get(MyLoggerService);
  const database = app.get(DatabaseService);

  await database.setUp();

  /**
   * Attach loggers
   * Attached here due to e2e test cyclic deps
   */
  app.useLogger(myLoggerService);
  app.useGlobalInterceptors(
    new ApiLoggerInterceptor(myLoggerService, configService),
  );

  const port = configService.get<number>('port');
  await app.listen(port);

  myLoggerService.log(`App listening on port ${port}`);
}
bootstrap();
