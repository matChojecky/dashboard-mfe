import type { WidgetInfo, WidgetSettings, Widget } from "./types";
import { WIDGET_STORAGE_KEY, noopModule } from "./constants";


function loadComponent(scope: string, module: string) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    // @ts-ignore
    await __webpack_init_sharing__("default");
    // @ts-ignore
    console.log(scope, window[scope])
    // @ts-ignore
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignoreś
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

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
    console.log(this.getSupportedWidgets());
    const widgets = this.getSupportedWidgets() as Widget[];

    try {
      for (const widget of widgets) {
        // @ts-ignore
        const widget_module = await loadComponent("air_polution_widget", './')();
        console.log(widget_module);
        widget.module = widget_module ?? noopModule(widget);
      }
    } catch (err) {
      console.error(err);
    }

    // return widgets;
    return Array(8)
      .fill(undefined)
      .map((_, idx) => ({
        name: "test",
        id: "testing-module-" + idx,
        settings: {
          width: Math.floor(Math.random() * 5),
          height: Math.floor(Math.random() * 5),
        },
        module: {
          mount(root) {
            root.innerHTML = `<h1>DUPA ${idx + 1}</h1>`;
          },
        },
      }));
  }
}
