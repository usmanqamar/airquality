import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpStatusCode } from 'axios';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { QualityDto } from '../src/quality/dto/quality.dto';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { QualityService } from '../src/quality/quality.service';

let mongod: MongoMemoryServer;
// Mock HTTP service of NestJS
const mockedHttpService = {
  get: jest.fn(),
};

const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = await mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

describe('Quality Controller (e2e)', () => {
  let app: INestApplication;
  let qualityService: QualityService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AppModule, HttpModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockedHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/quality (GET) should throw error if params are not passed', (done) => {
    request(app.getHttpServer())
      .get('/quality')
      .expect(HttpStatusCode.BadRequest)
      .end((err, res) => {
        done(err);
      });
  });

  it('/quality (GET) should return success if params passed', () => {
    mockedHttpService.get.mockImplementation(() =>
      of({ data: { data: { current: { pollution: new QualityDto() } } } }),
    );
    return request(app.getHttpServer())
      .get('/quality')
      .query({ latitude: '48.856613', longitude: '2.352222' })
      .expect(HttpStatusCode.Ok);
  });

  it('/quality/:city/most-polluted (GET) should return most polluted time', async () => {
    // Add sample data which cron will add
    const sampleData = new QualityDto();
    sampleData.ts = new Date().toISOString();
    sampleData.aqius = 10;
    sampleData.aqicn = 10;
    sampleData.maincn = 'o3';
    sampleData.mainus = 'o3';
    // Return mock data for http service
    mockedHttpService.get.mockImplementation(() =>
      of({ data: { data: { current: { pollution: sampleData } } } }),
    );
    qualityService = app.get<QualityService>(QualityService);
    await qualityService.saveAirQualityByCountry({
      latitude: '48.856613',
      longitude: '2.352222',
      city: 'Paris',
    });

    return request(app.getHttpServer())
      .get('/quality/Paris/most-polluted')
      .expect(HttpStatusCode.Ok)
      .then((res) => {
        expect(res.body.aqius).toEqual(10);
      });
  });
});
