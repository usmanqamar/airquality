import { ApiProperty } from '@nestjs/swagger';
export class MostPollutedResponse {
  @ApiProperty()
  createAt: Date;
  @ApiProperty()
  aqius: number;

  constructor(data: MostPollutedResponse) {
    this.createAt = data.createAt;
    this.aqius = data.aqius;
  }
}
