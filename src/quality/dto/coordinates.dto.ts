import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CoordinatesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '48.856613' })
  latitude: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2.352222' })
  longitude: string;
}
