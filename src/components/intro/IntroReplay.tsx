import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router-dom";
import IntroExperience from "./IntroExperience";
import { isBot, markIntroSeen } from "./introSession";

/** /intro — replay the full scroll journey any time, then land on the chosen page. */
const IntroReplay = () => {
  const navigate = useNavigate();
  if (isBot()) return <Navigate to="/" replace />;
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://mrcap1.com/" />
      </Helmet>
      <IntroExperience
        onFinish={(path) => {
          markIntroSeen();
          navigate(path || "/", { replace: true });
        }}
      />
    </>
  );
};

export default IntroReplay;
