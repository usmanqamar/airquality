import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AirQuality {
  @Prop()
  city: string;
  @Prop({ required: true })
  aqius: number;
  @Prop({ required: true })
  mainus: string;
  @Prop({ required: true })
  aqicn: number;
  @Prop({ required: true })
  maincn: string;
  @Prop({ required: true })
  createAt: Date;
}

export const AirQualitySchema = SchemaFactory.createForClass(AirQuality);

export type AirQualityDocument = AirQuality & Document;
