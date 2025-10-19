import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import ProductGrid from "../../components/Card/ProductGrid";
// import { products } from "./data/products";
import { initAOS } from "../../lib/aos-init";
import { getAllProduct } from "../../services/commonService";
function Products() {
  const [cart, setCart] = useState([]);
  const [products, setProduct] = useState([]);
  useEffect(() => {
    initAOS();
  }, []);
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`Added ${product.name} to cart!`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDataProduct = await getAllProduct()
        if (resDataProduct?.success) {
          setProduct(resDataProduct?.data)
        }
      } catch (error) {
        console.log("Loading product fail", error);
      }
    }
    fetchData();
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <h2
        data-aos="fade-down"
        data-aos-offset="100"
        data-aos-delay="200"
        data-aos-duration="500"
        data-aos-once="true"
        className="text-2xl font-bold text-blue-900 mb-8 border-l-4 border-blue-600 pl-3 "
      >
        CỬA HÀNG LÀM ĐẸP
      </h2>
      <main>
        <div
          data-aos="flip-right"
          data-aos-offset="100"
          data-aos-delay="200"
          data-aos-duration="500"
          data-aos-once="true"
        >
          {" "}
          <HeroBanner />
        </div>
        <div data-aos="fade-up" className="my-8" >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Mỹ phẩm cao cấp chính hãng
            </h2>
            <a
              href="/shop"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
      </main>
    </div>
  );
}

export default Products;
