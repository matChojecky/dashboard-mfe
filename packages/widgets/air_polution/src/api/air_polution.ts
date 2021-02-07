// https://api.waqi.info/feed/krakow/?token=f4bb3f6a14602ca9cfd35f5d9c9f1355072016ee

import { idText } from "typescript";

type Polution =
  | "co"
  | "dev"
  | "h"
  | "no2"
  | "o3"
  | "p"
  | "pm10"
  | "pm25"
  | "so2"
  | "t"
  | "w"
  | "wg";

interface WAQIResponse {
  status: "ok" | "error";
  data: WAQIResponseData;
}
interface WAQIResponseData {
  aqi: number;
  idx: number;
  dominentpol: Polution;
  iaqi: {
    [key in Polution]: {
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
  dominentPolition: Polution;
  individualAirQualityIndex: {
    [key in Polution]: number;
  };
}

const normalizeResponseData = (response: WAQIResponseData): AirQualityData => {
  return {
    aqi: response.aqi,
    dominentPolition: response.dominentpol,
    individualAirQualityIndex: Object.entries(response.iaqi).reduce(
      (curr, [key, value]) => {
        curr[key] = value.v;
        return curr;
      },
      {} as { [key in Polution]: number }
    ),
  };
};

export async function getAirQualityData(): Promise<any> {
  const response = await fetch(
    "https://api.waqi.info/feed/krakow/?token=f4bb3f6a14602ca9cfd35f5d9c9f1355072016ee"
  );
  const data: WAQIResponse = await response.json();

  if (data.status !== "ok") {
  }

  return normalizeResponseData(data.data);
}
