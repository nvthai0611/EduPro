"use client";

import Layout from "./core/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import useDevtoolsGuard from "./core/useDevtoolsGuard";

const App = ({ isDashHost = false }) => {
  useDevtoolsGuard();

  return <Layout isDashHost={isDashHost} />;
};

export default App;