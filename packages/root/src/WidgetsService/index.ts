import type { WidgetInfo, WidgetSettings, Widget } from "./types";
import { WIDGET_STORAGE_KEY, noopModule } from "./constants";
import * as AssetsLoader from "./assets_loader";

export default class WidgetService {
  constructor(private widgets: WidgetInfo[]) {}

  updateUsedWidgets(id: string, changes: Record<string, unknown>) {
    const widgets = this.getUsedWidgets() ?? {};

    widgets[id] = {
      ...widgets[id],
      settings: Object.assign(widgets[id]?.settings ?? {}, changes),
    };

    window.localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(widgets));
  }

  getUsedWidgets(): { [key: string]: WidgetSettings } {
    return JSON.parse(window.localStorage.getItem(WIDGET_STORAGE_KEY) ?? "{}");
  }

  getUsedWidget(id: string): WidgetSettings {
    const used_widgets = this.getUsedWidgets();
    return used_widgets[id];
  }

  removeUsedWidget(id: string): void {
    const widgets = this.getUsedWidgets() ?? {};
    delete widgets[id];
    window.localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(widgets));
  }

  get supportedWidgets() {
    return [...this.widgets];
  }

  async importWidgets(): Promise<Widget[]> {
    // const widgets = Object.values(this.getUsedWidgets()) as Widget[];
    const widgets = this.supportedWidgets as Widget[];

    await Promise.all(widgets.map((w) => AssetsLoader.loadScript(w.url)));

    try {
      for (const widget of widgets) {
        const widget_module = await AssetsLoader.loadComponent(widget.id)();
        widget.settings = widget.settings ?? {
          width: 2,
          height: 2,
        };
        widget.module = widget_module ?? noopModule(widget);
      }
    } catch (err) {
      console.error(err);
    }

    return widgets;
  }
}
