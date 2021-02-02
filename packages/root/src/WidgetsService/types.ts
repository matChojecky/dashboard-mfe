import type { WidgetModule } from "../widget";

export interface WidgetInfo {
  name: string;
  id: string;
  url: string;
}

export interface WidgetSettings extends WidgetInfo {
  settings: {
    width: number;
    height: number;
    [key: string]: unknown;
  };
}

export interface Widget extends WidgetSettings {
  module: WidgetModule;
}
