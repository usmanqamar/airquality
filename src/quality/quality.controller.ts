import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QualityService } from './quality.service';
import CoordinatesDto from './dto/coordinates.dto';
import { map, Observable } from 'rxjs';
import { QualityResponse } from './responses/quality.response';
import { MostPollutedResponse } from './responses/most-polluted.response';
import { Cron } from '@nestjs/schedule';
import { QualityDto } from './dto/quality.dto';

@ApiTags('Air Quality')
@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @ApiExtraModels(QualityDto)
  @ApiResponse({
    status: 200,
    type: QualityResponse,
  })
  @Get()
  getAirQuality(
    @Query(new ValidationPipe()) coordinates: CoordinatesDto,
  ): Observable<QualityResponse> {
    return this.qualityService.getQualityByCoordinates(coordinates).pipe(
      map((data) => {
        return new QualityResponse(data);
      }),
    );
  }

  @ApiResponse({
    status: 200,
    type: MostPollutedResponse,
  })
  @ApiQuery({
    name: 'city',
    required: true,
    example: 'Paris',
  })
  @Get(':city/most-polluted')
  async getMostPollutedTimeByCity(
    @Param('city') city: string,
  ): Promise<MostPollutedResponse> {
    const data = await this.qualityService.getMostPollutedTimeByCity(city);
    return new MostPollutedResponse(data);
  }

  // Cron job every minute to get data of given city
  @Cron('* * * * *')
  async scheduleAirQualityFetch() {
    return this.qualityService.saveAirQualityByCountry({
      latitude: '48.856613',
      longitude: '2.352222',
      city: 'Paris',
    });
  }
}
