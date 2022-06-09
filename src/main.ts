import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiLoggerInterceptor } from './common/interceptors/api-logger.interceptor';
import { MyLoggerService } from './common/modules/my-logger/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const myLoggerService = app.get(MyLoggerService);

  // enable cors
  app.enableCors();

  // app logger
  app.useLogger(myLoggerService);

  // api logger
  app.useGlobalInterceptors(new ApiLoggerInterceptor(myLoggerService));

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // start app
  const port = configService.get<number>('port');
  await app.listen(port);

  myLoggerService.log(`App listenting on port ${port}`);
}
bootstrap();
