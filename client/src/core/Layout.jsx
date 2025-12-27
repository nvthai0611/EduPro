import { privateRoutes } from "../routes/privateRoutes";
import { publicRoutes } from "../routes/publicRoutes";
import { Routes } from "react-router-dom";
import AdvisoryPage from '../pages/Home/AdvisoryPage';
const Layout = () => {
  return (
    <Routes>
      {publicRoutes}
      {privateRoutes}
    </Routes>
    
  );
};

export default Layout;
