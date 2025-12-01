import { useEffect } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

const UnicornBackground = () => {
  useEffect(() => {
    // Load Unicorn Studio script if not already loaded
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div className="aura-background-component top-0 w-full -z-10 absolute h-full pointer-events-none">
      <div 
        data-us-project="tPmIIl0vKqHO9yqmtge2" 
        className="absolute w-full h-full left-0 top-0 -z-10"
      />
    </div>
  );
};

export default UnicornBackground;
