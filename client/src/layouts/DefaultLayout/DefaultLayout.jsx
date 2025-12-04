import "./DefaultLayout.scss";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../../pages/Cart/CartItem/context/CartContext";
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
