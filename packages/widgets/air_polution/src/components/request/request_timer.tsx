import { useEffect, useState } from "react";
import styled from "styled-components";

export interface RequestTimerProps {
  requestTimestamp: number;
}

const rtf = new Intl.RelativeTimeFormat("en");

const RequestTimerText = styled.p`
  margin: 0;
  font-size: ${props => props.theme.width < 400 ? 0.246 : 0.369}em;
  color: #777777;
  font-weight: 600;
`;

export default function RequestTimer({ requestTimestamp }: RequestTimerProps) {
  const [_, setTimestamp] = useState<number>();
  useEffect(() => {
    const intervalID = window.setInterval(() => {
      setTimestamp(Date.now());
    }, 10000);
    return () => window.clearInterval(intervalID);
  }, [setTimestamp, requestTimestamp]);
  return (
    <RequestTimerText>
      {getRequestTimerStatusText(requestTimestamp)}
    </RequestTimerText>
  );
}

const getRequestTimerStatusText = (timestamp: number) => {
  const diffInMinutes = (Date.now() - timestamp) / 1000 / 60;
  if (diffInMinutes < 1) {
    return "Refreshed less than a minute ago.";
  }

  return `Refreshed ${rtf.format(-Math.floor(diffInMinutes), "minutes")}.`;
};
