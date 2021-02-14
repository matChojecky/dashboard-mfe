const {
  AirPolutionWidget,
} = require("./packages/widgets/air_polution/widget.config");
const {
  StonksWatcherWidget,
} = require("./packages/widgets/stonks/widget.config");

const WIDGETS_MAP = {
  AirPolutionWidget,
  StonksWatcherWidget,
};

module.exports = WIDGETS_MAP;

module.exports.SUPPORTED_WIDGETS = (function (env) {
  const widgets = Object.values(WIDGETS_MAP);
  return widgets.map((w) => ({ ...w, url: w.url[env] }));
})(process.env.NODE_ENV?.toLowerCase() ?? "development");
