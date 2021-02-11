import { AIR_POLLUTION_LEVEL } from "../constants";

export const lookupAirPollutionLevel = (aqi: number) => {
  return (
    AIR_POLLUTION_LEVEL.find(
      (aqiLevel) => aqi >= aqiLevel.min && aqi < aqiLevel.max
    ) ?? AIR_POLLUTION_LEVEL[AIR_POLLUTION_LEVEL.length - 1]
  );
};
