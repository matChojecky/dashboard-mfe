import styled from "styled-components";
import { AirQualityData } from "../api/air_polution";
import { lookupAirPollutionLevel } from "../utils/lookup_air_polution_level";

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

const PollutionLevelIndicatior = styled.span<{ pollutionLevelColor: string }>`
  width: 1em;
  height: 1em;
  background-color: ${(props) => props.pollutionLevelColor};
  display: inline-block;
  border-radius: 5px;
`;

export default function PollutantsDetails({ iaqi }: PollutantsDetailsProps) {
  return (
    <ul>
      {(Object.entries(iaqi) as [keyof AirQualityData["iaqi"], number][]).map(
        ([key, value]) => {
          const aqiLevel = lookupAirPollutionLevel(value);
          return (
            <li>
              {renderPollutantName(key)} -- {value} -- <PollutionLevelIndicatior pollutionLevelColor={aqiLevel.color} />
            </li>
          );
        }
      )}
    </ul>
  );
}
