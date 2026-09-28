import { useNavigate } from "react-router-dom";
import IntroExperience from "./IntroExperience";
import { markIntroSeen } from "./IntroGate";

/** /intro — replay the full scroll journey any time, then land on the chosen page. */
const IntroReplay = () => {
  const navigate = useNavigate();
  return (
    <IntroExperience
      onFinish={(path) => {
        markIntroSeen();
        navigate(path || "/", { replace: true });
      }}
    />
  );
};

export default IntroReplay;
