import { ApiProperty } from '@nestjs/swagger';

export class QualityDto {
  @ApiProperty()
  ts: string;
  @ApiProperty()
  aqius: number;
  @ApiProperty()
  mainus: string;
  @ApiProperty()
  aqicn: number;
  @ApiProperty()
  maincn: string;
}
