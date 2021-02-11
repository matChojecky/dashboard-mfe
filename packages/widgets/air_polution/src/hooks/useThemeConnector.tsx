import { useEffect, useState } from "react";

export const useThemeConnector = (root: Element) => {
  const [theme, setTheme] = useState({
    width: root.clientWidth,
    height: root.clientHeight,
  });
  useEffect(() => {
    const resizeEffect = () => {
      const { clientWidth: width, clientHeight: height } = root;
      console.log({width, height})
      setTheme((prev) => Object.assign({}, prev, { height, width }));
    };
    window.addEventListener("resize", resizeEffect);

    return () => window.removeEventListener("resize", resizeEffect);
  }, [root]);

  return theme;
};
