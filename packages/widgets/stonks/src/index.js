import { app, h, text } from "hyperapp";

export function mount(root) {
  console.log(root);
  const appNode = document.createElement("div");
  root.appendChild(appNode);
  app({
    view: () => h("h1", {}, text("FUCK YEAHH RENDERING STONKS WIDGET")),
    node: appNode,
  });
}
