export function mount(root: Element) {
    const container = document.createElement('iframe');
    container.src = 'https://noaignite.pl';
    container.width = '100%';
    container.height = '100%';
    console.log("VI");
    root.appendChild(container);
}