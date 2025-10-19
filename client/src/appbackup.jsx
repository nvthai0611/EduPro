"use client";

import { useEffect } from "react";
import Layout from "./core/Layout";
import { useBookingStore } from "./stores/zustand/bookingStore";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import socketService from "./utils/socket";
import DevToolsProtection from "./components/DevToolsProtection/DevToolsProtection";
// import CursorTrail from "./stores/animations/CursorTrail";
// import MagicCursor from "./stores/animations/MagicCursor";
// import FireworksCursor from "./stores/animations/FireworksCursor";

const App = () => {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    const maxAge = 24 * 60 * 60 * 1000; // 1 ngày
    const now = Date.now();
    const { bookingStartTime, resetBooking } = useBookingStore.getState();

    if (bookingStartTime && now - bookingStartTime > maxAge) {
      resetBooking();
    }
  }, []);
  // Thêm CSS cho cursor effects
  // useEffect(() => {
  //   const style = document.createElement("style");
  //   style.textContent = `
  //     * {
  //       cursor: none !important;
  //     }
      
  //     /* Giữ cursor cho các input và text areas */
  //     input, textarea, [contenteditable] {
  //       cursor: text !important;
  //     }
      
  //     /* Giữ cursor cho các link và button */
  //     a, button, [role="button"] {
  //       cursor: pointer !important;
  //     }
      
  //     /* Hiệu ứng hover cho các elements */
  //     button,
  //     a,
  //     [role="button"] {
  //       transition: all 0.3s ease;
  //       position: relative;
  //       overflow: hidden;
  //     }

  //     button:hover,
  //     a:hover,
  //     [role="button"]:hover {
  //       transform: translateY(-2px);
  //       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  //     }

  //     /* Hiệu ứng ripple khi click */
  //     button::before,
  //     a::before,
  //     [role="button"]::before {
  //       content: "";
  //       position: absolute;
  //       top: 50%;
  //       left: 50%;
  //       width: 0;
  //       height: 0;
  //       border-radius: 50%;
  //       background: rgba(255, 255, 255, 0.3);
  //       transform: translate(-50%, -50%);
  //       transition: width 0.6s, height 0.6s;
  //       z-index: 1;
  //     }

  //     button:active::before,
  //     a:active::before,
  //     [role="button"]:active::before {
  //       width: 300px;
  //       height: 300px;
  //     }

  //     /* Tối ưu cho mobile */
  //     @media (max-width: 768px) {
  //       * {
  //         cursor: auto !important;
  //       }
  //     }
  //   `;

  //   document.head.appendChild(style);

  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);
  return (
    <>
      {/* DevTools Protection */}
      <DevToolsProtection />
      
      {/* Các hiệu ứng cursor toàn cục */}
      {/* <CursorTrail />
      <MagicCursor />
      <FireworksCursor /> */}

      {/* Layout chính của app */}
      <Layout />
    </>
  );
};

export default App;
