import React from "react";
import { getAirQualityData, AIR_QUALITY_QUERY_KEY } from "./api/air_polution";
import styled, { ThemeProvider } from "styled-components";

import "./index.css";
import { FillContainerLoader } from "./components/loader";
import PollutantsDetails from "./components/pollutants_details";
import AqiIndicator from "./components/aqi_indicator";
import { useThemeConnector } from "./hooks/useThemeConnector";
import { useQuery, QueryClientProvider, QueryClient } from "react-query";

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 1em;
  font-size: 2em;
  font-family: "Fira Sans", sans-serif;

  display: flex;
  flex-direction: column;
`;

interface ConnectorProps {
  rootNode: Element;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function connect(Component: React.FunctionComponent) {
  return function Connected({ rootNode }: ConnectorProps) {
    const theme = useThemeConnector(rootNode);
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Component />
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
}

function App() {
  const { data, isSuccess } = useQuery(
    AIR_QUALITY_QUERY_KEY,
    getAirQualityData,
    { refetchInterval: 15 * 60 * 1000 }
    // { refetchInterval: 30 * 1000 }
  );

  return (
    <WidgetContainer>
      {isSuccess && !!data ? (
        <>
          <AqiIndicator {...data} />
          <PollutantsDetails iaqi={data.iaqi} />
        </>
      ) : (
        <FillContainerLoader />
      )}
    </WidgetContainer>
  );
}

export default connect(App);
