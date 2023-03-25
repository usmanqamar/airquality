import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupSwagger(app);
  await app.listen(configService.get('PORT'));
}

// Setup swagger specs
function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Assignment')
    .setDescription('Sample assignment for air quality check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
}
bootstrap();
