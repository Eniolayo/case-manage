import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Import MSW for development
if (import.meta.env.DEV) {
  import("./lib/mock-worker").then(({ worker }) => {
    worker
      .start({
        onUnhandledRequest: "warn",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      })
      .then(() => {
        console.log("MSW worker started successfully");
      })
      .catch((error) => {
        console.error("Failed to start MSW worker:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
