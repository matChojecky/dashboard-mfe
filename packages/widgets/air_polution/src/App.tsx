import React, { useEffect, useState } from "react";
import { getAirQualityData, AirQualityData } from "./api/air_polution";
import styled, { ThemeProvider } from "styled-components";

import "./index.css";
import { FillContainerLoader } from "./components/loader";
import PollutantsDetails from "./components/pollutants_details";
import AqiIndicator from "./components/aqi_indicator";
import { useThemeConnector } from "./hooks/useThemeConnector";

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 1em;
  font-size: 2em;
  font-family: "Fira Sans", sans-serif;
`;

interface AppProps {
  rootNode: Element;
}

export default function App({ rootNode }: AppProps) {
  const [airQ, setAirData] = useState<AirQualityData>();
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
  const theme = useThemeConnector(rootNode);
  return (
    <ThemeProvider theme={theme}>
      <WidgetContainer>
        {!!airQ ? (
          <>
            <AqiIndicator aqi={airQ.aqi} />
            <PollutantsDetails iaqi={airQ.iaqi} />
          </>
        ) : (
          <FillContainerLoader />
        )}
      </WidgetContainer>
    </ThemeProvider>
  );
}
