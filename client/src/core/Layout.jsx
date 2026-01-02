import { privateRoutes } from "../routes/privateRoutes";
import { publicRoutes } from "../routes/publicRoutes";
import adminSubdomainRoutes from "../routes/adminSubdomainRoutes";
import { Routes } from "react-router-dom";
import AdvisoryPage from '../pages/Home/AdvisoryPage';

const Layout = ({ isDashHost = false }) => {
  return (
    <Routes>
      {!isDashHost && publicRoutes}
      {!isDashHost && privateRoutes}
      {isDashHost && adminSubdomainRoutes}
    </Routes>
  );
};

export default Layout;
