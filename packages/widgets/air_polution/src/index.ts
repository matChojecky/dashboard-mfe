import React from 'react';
import { render } from 'react-dom';
import App from './App';

export function mount(root: Element) {
  render(React.createElement(App, {rootNode: root}), root);
}
