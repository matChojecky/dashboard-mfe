import Application from './app';
import Dashboard from "./screens/Dashboard";
import Settings from "./screens/Settings";
import WidgetService from "./WidgetsService";
import { SUPPORTED_WIDGETS } from "../../../widgets.config";


const _widgetService = new WidgetService(
  SUPPORTED_WIDGETS.map(({ name, id, ...rest }) => ({ name, id }))
);

const app = new Application(
  new Dashboard(_widgetService),
  new Settings(_widgetService)
);

