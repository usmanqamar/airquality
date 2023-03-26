import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { QualityDto } from '../dto/quality.dto';

export class QualityResponse {
  @ApiProperty({
    type: 'object',
    properties: {
      Pollution: {
        $ref: getSchemaPath(QualityDto),
      },
    },
  })
  Result = { Pollution: {} };

  constructor(data: QualityDto) {
    Object.assign(this.Result.Pollution, data);
  }
}
