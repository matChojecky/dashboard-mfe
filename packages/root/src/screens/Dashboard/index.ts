import { _View } from "../../base/view";
import type WidgetService from "../../WidgetsService";
import { Widget } from "../../WidgetsService/types";

export default class Dashboard extends _View {
  constructor(private _widgetService: WidgetService) {
    super("dashboard");
    this._view.classList.add("dashboard-layout");
  }

  //   private setupWidgets(): Promise<any> {
  //     return Promise.all([]);
  //   }

  async run() {
    const widgets: Widget[] = await this._widgetService.importWidgets();

    widgets.forEach((_widget) => {
      const widgetContainer = document.createElement("section");
      const { width = 2, height = 2, ...settings } = _widget.settings;

      widgetContainer.id = _widget.id;
      widgetContainer.classList.add("widget");
      widgetContainer.classList.add(`widget-width-span-${width}`);
      widgetContainer.classList.add(`widget-height-span-${height}`);
      this._view.appendChild(widgetContainer);

      _widget.module.mount(widgetContainer, settings);
    });
  }

  mount() {
    window.document.body.prepend(this._view);
  }

  unmount() {
    this._view.remove();
  }
}
