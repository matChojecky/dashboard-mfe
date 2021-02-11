import { useEffect, useState } from "react";

type WidgetOrientation = "HORIZONTAL" | "VERTICAL" | "SQUARE";

const getOrientation = (width: number, height: number): WidgetOrientation => {
  const diff = width / height;
  if (diff > 1.1) return "HORIZONTAL";

  if (diff < 0.9) return "VERTICAL";

  return "SQUARE";
};

export const useThemeConnector = (root: Element) => {
  const [theme, setTheme] = useState({
    width: root.clientWidth,
    height: root.clientHeight,
    orientation: getOrientation(root.clientWidth, root.clientHeight),
  });
  useEffect(() => {
    const resizeEffect = () => {
      const { clientWidth: width, clientHeight: height } = root;
      console.log({ width, height });
      setTheme((prev) =>
        Object.assign({}, prev, {
          height,
          width,
          orientation: getOrientation(width, height),
        })
      );
    };
    window.addEventListener("resize", resizeEffect);

    return () => window.removeEventListener("resize", resizeEffect);
  }, [root]);

  return theme;
};
