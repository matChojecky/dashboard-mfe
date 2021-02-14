const _loadedScripts: Set<string> = new Set();

export function loadComponent(scope: string, module = "./") {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    // @ts-ignore
    await __webpack_init_sharing__("default");
    // @ts-ignore
    // @ts-ignore
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (_loadedScripts.has(url)) {
      resolve();
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = url;
    script.onload = () => {
      _loadedScripts.add(url);
      resolve();
    };
    script.onerror = () => reject(`Remote ${url} failed to load script`);

    window.document.head.appendChild(script);
  });
}
