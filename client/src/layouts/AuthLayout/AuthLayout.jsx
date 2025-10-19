import { Outlet } from "react-router-dom";
import "./AuthLayout.scss";
const AuthLayout = () => {
  return (
    <div className="auth">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
