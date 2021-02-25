import { h, text } from "hyperapp";
import { PoleHttpSubsctiption } from "../lib/PoleHttpSubsctiption";
import styles from "./style.module.scss";

const API_TOKEN = "";

const WATCHED_SYMBOLS = ["tsla", "amc", "gme", "CDR-PW"];

export const initStonksState = {
  stonksData: {},
};

const SetStockData = (state, data) => {
  console.log("STONKS: ");
  console.log({ data, state });

  return {
    ...state,
    stonksData: mapStockResponse(data),
  };
};

const mapStockResponse = (data) => {
  return Object.keys(data).reduce((acc, curr) => {
    acc[curr] = data[curr].quote;
    return acc;
  }, {});
};

export const stonksSubscriptions = () => [
  PoleHttpSubsctiption({
    url: `https://cloud.iexapis.com/v1/stock/market/batch?symbols=${WATCHED_SYMBOLS.join(
      ","
    )}&types=quote&filter=symbol,change,companyName,latestPrice&token=${API_TOKEN}`,
    action: SetStockData,
    interval: 30000 * 30,
    immediate: true,
  }),
];

const stockPriceItem = (entry) =>
  h("div", { class: styles["stonks-item"] }, [
    h(
      "div",
      {
        class: [
          styles["stonks-item-group"],
          styles["stonks-item-group--base75"],
        ],
      },
      [
        h("span", { class: ["chonky"] }, [text(entry.symbol)]),
        h(
          "span",
          {
            class: styles["stonks-item-group-fullname"],
          },
          [text(entry.companyName)]
        ),
      ]
    ),
    h(
      "div",
      {
        class: [
          styles["stonks-item-group"],
          styles["stonks-item-group--pad-right"],
          styles["stonks-item-group--base25"],
        ],
      },
      [
        h("span", {}, [text(entry.latestPrice)]),
        h(
          "span",
          {
            class: {
              [styles["stonks-item-group-change"]]: true,
              [styles["stonks-item-group-change--loss"]]: entry.change < 0,
              [styles["stonks-item-group-change--profit"]]: entry.change >= 0,
            },
          },
          [
            text(
              entry.change > 0
                ? String.fromCharCode("9650")
                : String.fromCharCode("9660")
            ),
            text(" "),
            text(Math.abs(entry.change).toFixed(4)),
          ]
        ),
      ]
    ),
  ]);

export const view = (state) =>
  h(
    "div",
    { class: styles["stonks-wrapper"] },
    Object.values(state.stonksData).map((x) => stockPriceItem(x))
  );
