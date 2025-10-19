"use client";

import { useEffect } from "react";
import Layout from "./core/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import socketService from "./utils/socket";


const App = () => {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);


  
  
  return (
    <>
      <Layout />
    </>
  );
};

export default App;
