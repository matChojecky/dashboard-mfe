// https://api.waqi.info/feed/krakow/?token=f4bb3f6a14602ca9cfd35f5d9c9f1355072016ee

import { AirPollutionPmLevels } from "../constants";

type AirPollutionKey = "co" | "no2" | "o3" | "pm10" | "pm25" | "so2";

interface WAQIResponse {
  status: "ok" | "error";
  data: WAQIResponseData;
}

interface WAQIResponseData {
  aqi: number;
  idx: number;
  dominentpol: AirPollutionKey;
  iaqi: {
    [key in AirPollutionKey]: {
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

interface AirQualityData {
  aqi: number;
  level: string;
  color: string;
  iaqui: {
    [key in AirPollutionKey]: number;
  }
}

const normalizeResponseData = (response: WAQIResponseData): AirQualityData => {
  const aqi = response.iaqi["pm25"].v;
  const { level, color } = AirPollutionPmLevels.find(
    (aqiLevel) => aqi >= aqiLevel.min && aqi < aqiLevel.max
  );
  return {
    aqi,
    level,
    color,
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
