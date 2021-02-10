import { AirQualityData } from "../api/air_polution";

interface PollutantsDetailsProps {
  iaqi: AirQualityData["iaqi"];
}

const pollutantNamesRenderer: {
  [key in keyof AirQualityData["iaqi"]]: () => React.ReactNode;
} = {
  ["pm25"]: () => (
    <>
      PM<sub>2.5</sub>
    </>
  ),
  ["pm10"]: () => (
    <>
      PM<sub>10</sub>
    </>
  ),
  ["so2"]: () => (
    <>
      SO<sub>2</sub>
    </>
  ),
  ["co"]: () => <>CO</>,
  ["no2"]: () => (
    <>
      NO<sub>2</sub>
    </>
  ),
  ["o3"]: () => (
    <>
      O<sub>3</sub>
    </>
  ),
};

const renderPollutantName = (
  pollutantKey: keyof AirQualityData["iaqi"]
): React.ReactNode => {
  return pollutantNamesRenderer[pollutantKey]();
};

export default function PollutantsDetails({ iaqi }: PollutantsDetailsProps) {
  return (
    <ul>
      {(Object.entries(iaqi) as [keyof AirQualityData["iaqi"], number][]).map(
        ([key, value]) => {
          return (
              <li>
                  {renderPollutantName(key)} -- {value}
              </li>
          )
          
        }
      )}
    </ul>
  );
}
