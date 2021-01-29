export abstract class _View {
    _view: Element;
    constructor(id: string) {
        this._view = document.createElement("div");
        this._view.id = id;
    }

    abstract mount(): void;
    abstract unmount(): void;
}