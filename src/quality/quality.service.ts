import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { AxiosError } from 'axios/index';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import CoordinatesDto from './dto/coordinates.dto';
import { AirQualityResponse } from './types/AirQualityResponse';
import { QualityDto } from './dto/quality.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AirQuality } from '../schema/airquality.schema';
import { Document, Model } from 'mongoose';

@Injectable()
export class QualityService {
  POLLUTION_NEAREST = 'v2/nearest_city';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectModel(AirQuality.name) private airQualityModel: Model<AirQuality>,
  ) {}

  /**
   * Get air quality by coordinates
   * @param latitude
   * @param longitude
   */
  getQualityByCoordinates({
    latitude,
    longitude,
  }: CoordinatesDto): Observable<QualityDto> {
    const apiUrl = `${this.config.get('IQAIR_URL')}${this.POLLUTION_NEAREST}`;
    return this.http
      .get<AirQualityResponse>(apiUrl, {
        params: {
          key: this.config.get('IQAIR_API_KEY'),
          lat: latitude,
          lon: longitude,
        },
      })
      .pipe(
        map(({ data }) => data.data?.current?.pollution),
        catchError((e: AxiosError) => {
          throw new BadRequestException(e.message);
        }),
      );
  }

  /**
   * Get most polluted time of city
   * @param latitude
   * @param longitude
   */
  async getMostPollutedTimeByCity(city: string): Promise<any> {
    const qualityData = await this.airQualityModel
      .find({ city: city })
      .sort({ aqius: -1, createdAt: -1 })
      .limit(1)
      .lean();
    return qualityData[0];
  }

  async saveAirQualityByCountry({
    latitude,
    longitude,
    city,
  }: CoordinatesDto & { city: string }): Promise<Document> {
    const qualityData = await firstValueFrom(
      this.getQualityByCoordinates({
        latitude,
        longitude,
      }),
    );

    return await this.airQualityModel.create({
      ...qualityData,
      createAt: qualityData.ts,
      city,
    });
  }
}
