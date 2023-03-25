export type AirQualityResponse = {
  data: {
    current: {
      pollution: {
        ts: string;
        aqius: number;
        mainus: string;
        aqicn: number;
        maincn: string;
      };
    };
  };
};
