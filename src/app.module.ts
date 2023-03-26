import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QualityModule } from './quality/quality.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ScheduleModule } from '@nestjs/schedule';

mongoose.set('debug', true);
@Module({
  imports: [
    QualityModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('MONGO_CONNECTION'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
