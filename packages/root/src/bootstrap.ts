import Application from "./app";
import Dashboard from "./screens/Dashboard";
import Settings from "./screens/Settings";
import WidgetService from "./WidgetsService";
import { SUPPORTED_WIDGETS } from "../../../widgets.config";
console.log({ SUPPORTED_WIDGETS });
const _widgetService = new WidgetService(SUPPORTED_WIDGETS);

const app = new Application(
  new Dashboard(_widgetService),
  new Settings(_widgetService)
);
