import { app } from "hyperapp";
import "./index.scss";
import {
  stonksSubscriptions,
  view as StonksView,
  initStonksState,
} from "./stonks/Stonks";

export function mount(root) {
  const appNode = document.createElement("div");
  root.appendChild(appNode);
  app({
    init: {
      ...initStonksState,
    },
    view: StonksView,
    node: appNode,
    subscriptions: (state) => [...stonksSubscriptions(state)],
  });
}
