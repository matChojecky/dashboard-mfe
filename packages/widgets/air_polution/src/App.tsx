import React, { useEffect, useState } from "react";
import {
  getAirQualityData,
  AirQualityData,
  AIR_QUALITY_QUERY_KEY,
} from "./api/air_polution";
import styled, { ThemeProvider } from "styled-components";

import "./index.css";
import { FillContainerLoader } from "./components/loader";
import PollutantsDetails from "./components/pollutants_details";
import AqiIndicator from "./components/aqi_indicator";
import { useThemeConnector } from "./hooks/useThemeConnector";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  useQueryClient,
} from "react-query";

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 1em;
  font-size: 2em;
  font-family: "Fira Sans", sans-serif;
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

const rtf = new Intl.RelativeTimeFormat("en");

function App() {
  const { data, isSuccess, isFetching } = useQuery(
    AIR_QUALITY_QUERY_KEY,
    getAirQualityData,
    { refetchInterval: 5 * 60 * 1000 }
    // { refetchInterval: 30 * 1000 }
  );

  const queryClient = useQueryClient();
  return (
    <WidgetContainer>
      {isFetching && "Fetching!!!"}
      {isSuccess && !!data ? (
        <>
          <AqiIndicator aqi={data.aqi} />
          <PollutantsDetails iaqi={data.iaqi} />
          <RequestTimer requestTimestamp={isFetching ? Date.now() : data.requestTimestamp} />
          <button
            onClick={() => queryClient.invalidateQueries(AIR_QUALITY_QUERY_KEY)}
          >
            Invalidate data!
          </button>
        </>
      ) : (
        <FillContainerLoader />
      )}
    </WidgetContainer>
  );
}

function RequestTimer({ requestTimestamp }: { requestTimestamp: number }) {
  const [timeText, setTimeText] = useState(
    rtf.format(Math.round((requestTimestamp - Date.now()) / 60000), "minutes")
  );
  useEffect(() => {
    const intervalID = window.setInterval(() => {
      const timeDiff = (requestTimestamp - Date.now()) / 1000;
      setTimeText(() => {
        // if (Math.abs(timeDiff) < 60) {
        //   return "less than minute ago";
        // }
        // return rtf.format(Math.round(timeDiff / 60), "minutes");
        return rtf.format(timeDiff / 60, "minutes");
      });
    }, 4000);
    return () => window.clearInterval(intervalID);
  }, [setTimeText, requestTimestamp]);
  return <span>Requested {timeText}.</span>;
}

export default connect(App);
