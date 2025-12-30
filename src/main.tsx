import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aggressively ensure title is clean without any icons
const cleanTitle = "MetroConnect";
document.title = cleanTitle;

// Override title setter to prevent modifications
const titleElement = document.querySelector("title");
if (titleElement) {
  let titleValue = cleanTitle;
  Object.defineProperty(document, "title", {
    get: () => titleValue,
    set: (val) => {
      titleValue = cleanTitle;
      titleElement.textContent = cleanTitle;
    },
    configurable: true
  });
  
  // Watch for direct DOM changes
  const observer = new MutationObserver(() => {
    if (titleElement.textContent !== cleanTitle) {
      titleElement.textContent = cleanTitle;
      titleValue = cleanTitle;
    }
  });
  observer.observe(titleElement, {
    childList: true,
    characterData: true,
    subtree: true
  });
  
  // Aggressive periodic check
  setInterval(() => {
    if (document.title !== cleanTitle || titleElement.textContent !== cleanTitle) {
      document.title = cleanTitle;
      titleElement.textContent = cleanTitle;
      titleValue = cleanTitle;
    }
  }, 50);
}

createRoot(document.getElementById("root")!).render(<App />);
