import "./index.css"
import './assets/css/style.css'
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./lib/i18n"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { disableConsoleInProduction } from "./utils/logger";

// Tắt console logs trong production
disableConsoleInProduction();

// // Global alert management
// window.devToolsAlertShown = false;
// window.showDevToolsAlert = () => {
//   if (!window.devToolsAlertShown) {
//     window.devToolsAlertShown = true;
//     alert('Hệ thống không cho phép người dùng can thiệp vào trình duyệt');
//     setTimeout(() => {
//       window.devToolsAlertShown = false;
//     }, 2000);
//   }
// };

// Prevent developer tools from opening
// const preventDevTools = () => {
//   // Only apply protection in production
//   if (import.meta.env.VITE_PROD === "production") {
//     // Disable right-click
//     document.addEventListener('contextmenu', (e) => {
//       e.preventDefault();
//       window.showDevToolsAlert();
//       return false;
//     });

//     // Disable keyboard shortcuts
//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'F12' || 
//           (e.ctrlKey && e.shiftKey && e.key === 'I') || 
//           (e.ctrlKey && e.shiftKey && e.key === 'J') || 
//           (e.ctrlKey && e.key === 'U') ||
//           (e.ctrlKey && e.shiftKey && e.key === 'C')) {
//         e.preventDefault();
//         window.showDevToolsAlert();
//         return false;
//       }
//     });

//     // Additional protection - detect if dev tools are open
//     let devtools = { open: false, orientation: null };

//     setInterval(() => {
//       const threshold = 160;
//       const widthThreshold = window.outerWidth - window.innerWidth > threshold;
//       const heightThreshold = window.outerHeight - window.innerHeight > threshold;

//       if (widthThreshold || heightThreshold) {
//         if (!devtools.open) {
//           devtools.open = true;
//           // You can add custom action here when dev tools are detected
//           window.showDevToolsAlert();
//         }
//       } else {
//         devtools.open = false;
//       }
//     }, 500);

//     // Disable console
//     console.log = () => {};
//     console.warn = () => {};
//     console.error = () => {};
//     console.info = () => {};
//     console.debug = () => {};
//   }
// };

// Initialize protection
// preventDevTools();

const queryClient = new QueryClient();
// Detect dash subdomain to serve admin at root (dash.fuedupro.com)
const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const isDashSubdomain = hostname === "dash.fuedupro.com" || hostname.startsWith("dash.");
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App isDashHost={isDashSubdomain} />
    </QueryClientProvider>
  </BrowserRouter>
);
