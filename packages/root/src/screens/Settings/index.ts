import WidgetService from "../../WidgetsService";
import { _View } from '../../base/view';

export default class Settings extends _View {

  constructor(private _widgetService: WidgetService) {
    super("settings-screen");
    this._view.appendChild(this.appendSupportedWidgetsList());

  }

  mount() {
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => {
      window.document.body.appendChild(this._view);
      window.requestAnimationFrame(() => {
        this._view.classList.add("visible");
        window.document.body.classList.add("hidden-overflow");
      });
    });
  }

  unmount() {
    this._view.classList.remove("visible");
    window.setTimeout(() => {
      this._view.remove();
      window.document.body.classList.remove("hidden-overflow");
    }, 500);
  }

  appendSupportedWidgetsList() {
      const list = document.createElement('ul');

      this._widgetService.supportedWidgets.forEach(_widget => {
          const listItem = document.createElement('li');
          listItem.innerHTML = _widget.name;
          // listItem.addEventListener('click', () => {
          //     console.log('Clicked: ', _widget.id);
          // });
          list.appendChild(listItem);
      });

      return list;
  }
}
