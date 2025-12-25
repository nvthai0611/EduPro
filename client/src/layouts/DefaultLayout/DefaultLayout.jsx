import "./DefaultLayout.scss";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
const DefaultLayout = () => {
  // check permission ở đây thay vì middleware 


  
  return (
    // <CartProvider>
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  // </CartProvider>
  );
};

export default DefaultLayout;
