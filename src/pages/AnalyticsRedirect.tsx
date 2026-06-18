import { useEffect } from "react";

export default function AnalyticsRedirect() {
  useEffect(() => {
    window.location.replace("/analytics/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", fontFamily: "system-ui" }}>
      Loading analytics dashboard…
    </div>
  );
}
