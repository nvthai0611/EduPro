/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div >
      <div className="h-48 overflow-hidden rounded-t-2xl">
        {product.new ? (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-1 px-2 rounded-md shadow-lg animate-bounce">
            Mới
          </div>
        ) : null}
        <img
          onClick={() => {
            navigate(`/shop/${product?._id}`)
            window.scrollTo(0, 'smooth')
          }}
          src={product?.images[0] || "/placeholder.svg"}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="font-semibold text-gray-800 text-base mb-2 line-clamp-2 h-12">
          {product?.name}
        </h3>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-pink-600 font-bold text-sm">
            {product?.price.toLocaleString()} đ
          </span>
        </div>
      </div>
    </div>
  )
}
