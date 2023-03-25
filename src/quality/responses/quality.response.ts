import { ApiProperty } from '@nestjs/swagger';
import { QualityDto } from '../dto/quality.dto';
class Result {
  @ApiProperty({ type: QualityDto })
  Pollution: QualityDto;
}
export class QualityResponse {
  @ApiProperty({ type: Result })
  Result: Result = { Pollution: {} as QualityDto };
  constructor(data: QualityDto) {
    Object.assign(this.Result.Pollution, data);
  }
}
