import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { lookupAirPollutionLevel } from "../utils/lookup_air_polution_level";

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Indicator = styled.div<{ shadowColor: string }>`
  aspect-ratio: 1 / 1;
  max-width: ${(props) =>
    Math.floor(Math.min(props.theme.width, props.theme.height) * 0.5)}px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 50%;
  box-shadow: 0px 0px 15px 5px ${(props) => props.shadowColor + "88"};
`;

const IndicatorMeter = styled.div<{ color: string }>`
  border-radius: 100%;
  border: ${(props) => (props.theme.width > 500 ? 15 : 10)}px solid
    ${(props) => props.color};
  border-bottom-color: transparent;
  width: 75%;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: ${(props) => (props.theme.width > 500 ? 2 : 1)}rem;
`;

interface AqiIndicatorProps {
  aqi: number;
}

export default function AqiIndicator({ aqi }: AqiIndicatorProps) {
  const theme = useTheme();
  console.log({ theme });
  const { level, color } = useMemo(() => lookupAirPollutionLevel(aqi), [aqi]);
  return (
    <IndicatorWrapper>
      <Indicator shadowColor={color}>
        <IndicatorMeter color={color}>
          <div>{aqi}</div>
          <div>{level}</div>
        </IndicatorMeter>
      </Indicator>
    </IndicatorWrapper>
  );
}
