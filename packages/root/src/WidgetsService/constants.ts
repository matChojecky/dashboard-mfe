import { WidgetInfo } from "./types";

export const WIDGET_STORAGE_KEY = "widgets_settings";

export const noopModule = (widget: WidgetInfo) => {
  console.warn(`Module ${widget.name} with id ${widget.id} couldn't be found`);
  return {
    mount() {},
  };
};