import React, { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { lookupAirPollutionLevel } from "../utils/lookup_air_polution_level";
import RequestStatus, { RequestStatusProp } from "./request";

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
  box-shadow: 0px 0px 15px 5px ${(props) => props.shadowColor + "88"},
    inset 0px 0px 15px 5px #e0e0e0;
  position: relative;
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

const Level = styled.p`
  margin: 0;
  font-size: 0.75em;
`;

const Aqi = styled.h1`
  margin: 0;
  font-size: 1.2em;
`;

interface AqiIndicatorProps {
  aqi: number;
}

export default function AqiIndicator({
  aqi,
  requestTimestamp,
}: AqiIndicatorProps & RequestStatusProp) {
  const theme = useTheme();
  console.log({ theme });
  const { level, color } = useMemo(() => lookupAirPollutionLevel(aqi), [aqi]);
  return (
    <IndicatorWrapper>
      <Indicator shadowColor={color}>
        <IndicatorMeter color={color}>
          <Aqi>{aqi}</Aqi>
          <Level>{level}</Level>
        </IndicatorMeter>
        <RequestStatus requestTimestamp={requestTimestamp} />
      </Indicator>
    </IndicatorWrapper>
  );
}
