import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';


async function bootstrap() {

  
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
 
  const user = configService.get('RABBITMQ_USER')
  const password = configService.get('RABBITMQ_PASSWORD')
  const host = configService.get('RABBITMQ_HOST')
  const queueName = configService.get('RABBITMQ_QUEUE_NAME')
  const smptmpass = configService.get('SMTPUSER')
  const microservices = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {

    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'users_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await microservices.listen();
  await app.listen(3000)
}
bootstrap();
