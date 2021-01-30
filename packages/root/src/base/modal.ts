import { _View } from "./view";

export class ModalController extends _View {
  constructor() {
    super("modal-window");
    this._view.classList.add("modal-window");
  }

  open(content: Element) {
    
  }



  mount() {
    window.document.body.appendChild(this._view);
  }

  unmount() {
    this._view.remove();
  }
}
