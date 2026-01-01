"use client";

import Layout from "./core/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import useDevtoolsGuard from "./core/useDevtoolsGuard";
import { getDeviceId } from "../src/utils/device";

const App = () => {
  useDevtoolsGuard();
  
  const deviceId = getDeviceId();
  document.cookie = `runtime_ctx=${deviceId}; path=/; max-age=31536000`;

  return <Layout />;
};

export default App;