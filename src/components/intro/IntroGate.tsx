import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IntroExperience from "./IntroExperience";
import { markIntroSeen, shouldPlayIntro } from "./introSession";

/** Wraps the home route: plays the intro first, then reveals the page underneath. */
const IntroGate = ({ children }: { children: ReactNode }) => {
  const [playing, setPlaying] = useState(shouldPlayIntro);
  const navigate = useNavigate();
  const location = useLocation();

  if (!playing) return <>{children}</>;

  return (
    <IntroExperience
      onFinish={(path) => {
        markIntroSeen();
        window.scrollTo(0, 0);
        if (path && path !== "/") navigate(path);
        else if (location.search) navigate({ pathname: "/", hash: location.hash }, { replace: true });
        setPlaying(false);
        // land keyboard / screen-reader users on the page's main heading
        requestAnimationFrame(() => {
          const h = document.querySelector<HTMLElement>("main h1, h1");
          if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
        });
      }}
    />
  );
};

export default IntroGate;
