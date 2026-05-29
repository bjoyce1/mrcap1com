import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./design-system/tokens.css";

createRoot(document.getElementById("root")!).render(<App />);
