import React, { useEffect, useState } from "react";
import { getAirQualityData } from "./api/air_polution";

import styled, { css } from "styled-components";

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 1em;
  font-size: 2em;
`;

const TestIndicator = styled.div`
  background-color: ${(props) => props.color};
`;

export default function App() {
  const [airQ, setAirData] = useState(null);
  useEffect(() => {
    const doer = () => {
      getAirQualityData().then((data) => {
        console.log({ data });
        setAirData(data);
      });
    };
    doer();
    const interval = window.setInterval(doer, 5 * 60 * 1000);
    () => window.clearInterval(interval);
  }, [setAirData]);
  return (
    <WidgetContainer>
      {!!airQ ? (
        <TestIndicator color={airQ.color}>
          <div>{airQ.aqi}</div>
          <div>{airQ.level}</div>
        </TestIndicator>
      ) : (
        "LOADING!!!"
      )}
    </WidgetContainer>
  );
}
