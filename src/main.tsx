import { createRoot } from "react-dom/client";

// Captura UTMs imediatamente, antes do React inicializar
import "@/hooks/useUTM";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
