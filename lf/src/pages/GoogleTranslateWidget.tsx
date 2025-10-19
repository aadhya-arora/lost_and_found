// GoogleTranslateWidget.tsx
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: any;
  }
}

interface WidgetProps {
  pageLanguage?: string;
  includedLanguages?: string;
  layout?: any;
  style?: React.CSSProperties;
}

const GoogleTranslateWidget = ({
  pageLanguage = "en",
  includedLanguages = "en,hi,pa",
  layout,
  style,
}: WidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Avoid adding script multiple times
    if (!(window as any).googleTranslateScriptAdded) {
      const addScript = document.createElement("script");
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
      (window as any).googleTranslateScriptAdded = true;
    }

    window.googleTranslateElementInit = () => {
      if (containerRef.current && !loaded) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage,
            includedLanguages,
            layout: layout || window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          containerRef.current
        );
        setLoaded(true);
      }
    };
  }, [pageLanguage, includedLanguages, layout, loaded]);

  return <div ref={containerRef} style={{ display: "inline-block", ...style }}></div>;
};

export default GoogleTranslateWidget;
