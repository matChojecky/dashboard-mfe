export function mount(root: Element) {
  console.log(root);
  root.addEventListener('click', () => { console.log('This event handler was hooked from MFE') })
  root.innerHTML = `<h1> Wassssuppp I am rendered a bit better</h1>`
}
