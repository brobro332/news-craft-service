import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommonResponseInterceptor } from './common/interceptors/common-response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CommonResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
