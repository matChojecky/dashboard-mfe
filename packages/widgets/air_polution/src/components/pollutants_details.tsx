import Slider from "react-slick";
import styled from "styled-components";
import { AirQualityData } from "../api/air_polution";
import { lookupAirPollutionLevel } from "../utils/lookup_air_polution_level";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const PollutantsListWrapper = styled.div`
  margin-top: auto;
`;

const PollutantSliderItem = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0.4em 0.8em;
  margin: 0.5em;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.45);
  cursor: grab;
`;

const PollutantInfo = styled.div`
  color: grey;
  font-size: 0.5em;
  margin-right: auto;
  & p {
    margin: 0;
    white-space: pre;
  }
`;

const PollutionLevelIndicatior = styled.div<{ pollutionLevelColor: string }>`
  width: 0.51em;
  height: 0.51em;
  background-color: ${(props) => props.pollutionLevelColor};
  display: inline-block;
  border-radius: 5px;
  flex-shrink: 0;
`;

const SLIDER_SETTINGS = {
  dots: false,
  arrows: false,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: true,
  infinite: true,
};

const VERTICAL_SETTINGS = {
  dots: false,
  arrows: false,
  slidesToShow: 2,
  slidesToScroll: 2,
  vertical: true,
  verticalSwiping: true,
};

export default function PollutantsDetails({ iaqi }: PollutantsDetailsProps) {
  return (
    <PollutantsListWrapper>
      <Slider {...SLIDER_SETTINGS}>
        {(Object.entries(iaqi) as [keyof AirQualityData["iaqi"], number][]).map(
          ([key, value]) => {
            const aqiLevel = lookupAirPollutionLevel(value);
            return (
              <div key={key}>
                <PollutantSliderItem>
                  <PollutantInfo>
                    <p>{renderPollutantName(key)}</p>
                    <p>AQI: {value}</p>
                  </PollutantInfo>
                  <PollutionLevelIndicatior
                    pollutionLevelColor={aqiLevel.color}
                  />
                </PollutantSliderItem>
              </div>
            );
          }
        )}
      </Slider>
    </PollutantsListWrapper>
  );
}
