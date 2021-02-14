import React from "react";
import styled from "styled-components";
import ForceRequestButton from "./force_request_btn";
import RequestTimer, { RequestTimerProps } from "./request_timer";

export type RequestStatusProp = RequestTimerProps;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  max-width: ${(props) => (props.theme.width < 400 ? 70 : 110)}px;
  text-align: center;

  position: absolute;
  bottom: 10%;
`;

export default function RequestStatus({ requestTimestamp }: RequestStatusProp) {
  return (
    <Wrapper>
      <ForceRequestButton
        canForce={() => (Date.now() - requestTimestamp) / 1000 > 30}
      />
      <RequestTimer requestTimestamp={requestTimestamp} />
    </Wrapper>
  );
}
