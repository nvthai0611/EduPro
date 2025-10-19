"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RelatedProducts({ products, currentProductId }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const navigate = useNavigate()
  // Filter out the current product from related products
  const relatedProducts = products.filter((product) => product._id !== currentProductId)
  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1)
      else if (window.innerWidth < 768) setItemsPerView(2)
      else if (window.innerWidth < 1024) setItemsPerView(3)
      else setItemsPerView(4)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, relatedProducts.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [maxIndex])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border p-6 mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sản phẩm liên quan
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {relatedProducts?.map((product, index) => (
            <div key={product?._id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
              <div onClick={() => {
                navigate(`/shop/${product?._id}`)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }} className="group cursor-pointer h-full">
                <div className="bg-white rounded-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-xl">
                    <img
                      src={product?.images[0] || "/placeholder.svg"}
                      alt={product?.name}
                      width={300}
                      height={300}

                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product?.new && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                          Mới
                        </Badge>
                      )}
                      {product?.stock === 0 && (
                        <Badge variant="secondary" className="bg-gray-500 text-white shadow-lg">
                          Hết hàng
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {/* <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-9 h-9 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                      >
                        <Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
                      </Button>
                    </div> */}

                    {/* Floating Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {formatPrice(product?.price)}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 flex-1">
                      {product?.name}
                    </h3>
                    <h5 className="text-sm text-gray-500 line-clamp-2">
                      Mô tả: {product?.description}
                    </h5>

                    {/* {product?.stock > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Còn lại</span>
                          <span>{product?.stock} sản phẩm</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((product?.stock / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )} */}

                    {/* Add to Cart Button */}
                    {/* <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      size="sm"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
              ? "bg-gradient-to-r from-blue-600 to-purple-600 w-8"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
