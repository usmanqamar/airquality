import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QualityService } from './quality.service';
import CoordinatesDto from './dto/coordinates.dto';
import { map, Observable } from 'rxjs';
import { QualityResponse } from './responses/quality.response';
import { MostPollutedResponse } from './responses/most-polluted.response';

@ApiTags('Air Quality')
@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @ApiResponse({
    status: 200,
    type: QualityResponse,
  })
  @Get()
  async getAirQuality(
    @Query(new ValidationPipe()) coordinates: CoordinatesDto,
  ): Promise<Observable<QualityResponse>> {
    return this.qualityService.getQualityByCoordinates(coordinates).pipe(
      map((data) => {
        return new QualityResponse(data);
      }),
    );
  }

  @ApiResponse({
    status: 200,
    type: QualityResponse,
  })
  @Get(':city/most-polluted')
  async getMostPollutedTimeByCity(
    @Param('city') city: string,
  ): Promise<MostPollutedResponse> {
    const data = await this.qualityService.getMostPollutedTimeByCity(city);
    return new MostPollutedResponse(data);
  }
}
