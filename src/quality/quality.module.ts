import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { QualityController } from './quality.controller';
import { QualityService } from './quality.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQuality, AirQualitySchema } from '../schema/airquality.schema';
@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
  ],
  controllers: [QualityController],
  providers: [QualityService],
})
export class QualityModule {}
