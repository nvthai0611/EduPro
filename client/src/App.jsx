"use client";

import { useEffect } from "react";
import Layout from "./core/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  // useEffect(() => {
  //   // Lazy load socket service sau 2 giây để ưu tiên load UI trước
  //   const timer = setTimeout(() => {
  //     import("./utils/socket").then((module) => {
  //       const socketService = module.default;
  //       socketService.connect();
  //     });
  //   }, 2000);
    
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);
  
  return (
    <>
      <Layout />
    </>
  );
};

export default App;
