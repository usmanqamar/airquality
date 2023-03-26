import { Test, TestingModule } from '@nestjs/testing';
import { QualityController } from './quality.controller';
import { QualityService } from './quality.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AirQuality } from '../schema/airquality.schema';
import { first, of, throwError } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { QualityResponse } from './responses/quality.response';
import { QualityDto } from './dto/quality.dto';

const mockedHttpService = {
  get: jest.fn(),
};
const mockedModel = {
  create: jest.fn(),
};
describe('AppController', () => {
  let qualityController: QualityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [QualityController],
      providers: [
        QualityService,
        {
          provide: getModelToken(AirQuality.name),
          useValue: mockedModel,
        },
      ],
    })
      .overrideProvider(HttpService)
      .useValue(mockedHttpService)
      .compile();

    qualityController = app.get<QualityController>(QualityController);
  });

  describe('Get Air Quality Data ', () => {
    it('should return successful response', async () => {
      mockedHttpService.get.mockImplementation(() => of({ data: {} }));
      const response = await qualityController
        .getAirQuality({
          longitude: '',
          latitude: '',
        })
        .pipe(first())
        .toPromise();

      expect(response).toBeInstanceOf(QualityResponse);
    });

    it('should handle error gracefully if http throws error', () => {
      mockedHttpService.get.mockImplementation(() => throwError(''));
      const response = qualityController
        .getAirQuality({
          longitude: '',
          latitude: '',
        })
        .toPromise();

      expect(response).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('Save Air Quality Data ', () => {
    it('should save data successfully on cron function', async () => {
      mockedHttpService.get.mockImplementation(() =>
        of({ data: { data: { current: { pollution: new QualityDto() } } } }),
      );
      mockedModel.create.mockResolvedValue(true);
      const response = await qualityController.scheduleAirQualityFetch();
      expect(response).toBeTruthy();
    });

    it('should handle exception gracefully', async () => {
      mockedHttpService.get.mockImplementation(() =>
        of({ data: { data: { current: { pollution: new QualityDto() } } } }),
      );
      mockedModel.create.mockImplementation(() => {
        throw new Error('');
      });
      expect(
        qualityController.scheduleAirQualityFetch(),
      ).rejects.toThrowError();
    });
  });
});
