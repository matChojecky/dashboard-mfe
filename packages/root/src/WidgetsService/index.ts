import type { WidgetInfo, WidgetSettings, Widget } from "./types";
import { WIDGET_STORAGE_KEY, noopModule } from "./constants";

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

  getSupportedWidgets() {
    return this.widgets;
  }

  async importWidgets(): Promise<Widget[]> {
    // const widgets = Object.values(this.getUsedWidgets()) as Widget[];

    // for (const widget of widgets) {
    //   const widget_module = await import(widget.id);
    //   widget.module = widget_module ?? noopModule(widget);
    // }

    // return widgets;
    return Array(8).fill(undefined).map((_, idx) => (
        {
            name: "test",
            id: "testing-module-" +  idx,
            settings: {
              width: Math.floor(Math.random() * 5),
              height: Math.floor(Math.random() * 5),
            },
            module: {
              mount(root) {
                root.innerHTML = `<h1>DUPA ${idx + 1}</h1>`;
              },
            },
          }
    ));
  }
}
