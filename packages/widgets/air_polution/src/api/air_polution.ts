// https://api.waqi.info/feed/krakow/?token=f4bb3f6a14602ca9cfd35f5d9c9f1355072016ee
import { lookupAirPollutionLevel } from "../utils/lookup_air_polution_level";

const AirPolluttants = ["co", "no2", "o3", "pm10", "pm25", "so2"] as const;

type AirPollutionKey = typeof AirPolluttants[number];

const WAQIWeatherFeatures = ["t", "p", "w", "h"] as const;
type WAQIWeatherFeaturesKeys = typeof WAQIWeatherFeatures[number];

const WAQIPropertiesMap = {
  t: "temp",
  p: "pressure",
  w: "wind",
  h: "humidity",
} as const;

type WeatherFeatures = typeof WAQIPropertiesMap[keyof typeof WAQIPropertiesMap];

interface WAQIResponse {
  status: "ok" | "error";
  data: WAQIResponseData;
}

interface WAQIResponseData {
  aqi: number;
  idx: number;
  dominentpol: AirPollutionKey;
  iaqi: {
    [key in AirPollutionKey | WAQIWeatherFeaturesKeys]: {
      v: number;
    };
  };
  city: {
    geo: number[];
    name: string;
    url: string;
  };
  forecast: unknown; // check https://aqicn.org/json-api/doc/ I do not care about this at this point
  time: unknown; // check https://aqicn.org/json-api/doc/ I do not care about this at this point
  attributions: unknown; // check https://aqicn.org/json-api/doc/ I do not care about this at this point
}

export interface AirQualityData {
  aqi: number;
  iaqi: {
    [key in AirPollutionKey]: number;
  };
  weatherInfo: {
    [key in WeatherFeatures]: number;
  };
  requestTimestamp: number;
}

const normalizeResponseData = (response: WAQIResponseData): AirQualityData => {
  const aqi = response.iaqi["pm25"].v;
  return {
    aqi,
    iaqi: Object.fromEntries(
      Object.entries(response.iaqi)
        .filter(([key]) => (AirPolluttants as readonly string[]).includes(key))
        .map(([key, { v }]) => [key, v])
    ) as { [key in AirPollutionKey]: number },
    weatherInfo: Object.fromEntries(
      Object.entries(response.iaqi)
        .filter(([key]) =>
          (WAQIWeatherFeatures as readonly string[]).includes(key)
        )
        .map(([key, { v }]) => [
          WAQIPropertiesMap[key as WAQIWeatherFeaturesKeys],
          v,
        ])
    ) as { [key in WeatherFeatures]: number },
    requestTimestamp: Date.now(),
  };
};

export async function getAirQualityData(): Promise<AirQualityData> {
  const response = await fetch(
    "https://api.waqi.info/feed/krakow/?token=f4bb3f6a14602ca9cfd35f5d9c9f1355072016ee"
  );
  const data: WAQIResponse = await response.json();

  if (data.status !== "ok") {
  }

  return normalizeResponseData(data.data);
}

export const AIR_QUALITY_QUERY_KEY = "AIR_QUALITY_QUERY_KEY";
