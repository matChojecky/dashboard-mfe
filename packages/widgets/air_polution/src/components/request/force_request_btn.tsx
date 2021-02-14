import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { AIR_QUALITY_QUERY_KEY } from "../../api/air_polution";
// @ts-ignore
import refresh_icon from "./refresh_icon.svg";

const RefreshButton = styled.button.attrs(({ onClick, ...rest }) => {
  const [isAnimating, setAnimatingState] = useState(false);
  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnimatingState(true);
    if (typeof onClick === "function") {
      onClick(event);
    }
  };
  return {
    ...rest,
    onClick: onClickHandler,
    isAnimating,
    onAnimationEnd: () => setAnimatingState(false),
  };
})`
  background: url(${refresh_icon}) no-repeat;
  background-position: center;
  background-size: ${(props) =>
    props.theme.width < 400 ? "1.2em 1.2em" : "2em 2em"};
  width: ${(props) => (props.theme.width < 400 ? 1.2 : 2)}em;
  height: ${(props) => (props.theme.width < 400 ? 1.2 : 2)}em;
  border: none;
  color: #888888;
  cursor: pointer;
  outline: none;
  transition: all;
  &:active {
    transform: scale(0.9);
  }
  ${(props) => props.isAnimating && "animation: rotate 0.5s linear;"}

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface ForceRequestButtonProps {
  canForce: () => boolean;
}

export default function ForceRequestButton({
  canForce,
}: ForceRequestButtonProps) {
  const queryClient = useQueryClient();
  return (
    <RefreshButton
      onClick={() =>
        canForce() ? queryClient.invalidateQueries(AIR_QUALITY_QUERY_KEY) : null
      }
    />
  );
}
