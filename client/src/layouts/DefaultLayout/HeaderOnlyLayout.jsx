import Header from "./Header";
import { Outlet } from "react-router-dom";
const HeaderOnlyLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HeaderOnlyLayout;
