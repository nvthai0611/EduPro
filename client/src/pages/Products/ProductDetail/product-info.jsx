"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Minus, Plus, ShoppingCart, Star, StarHalf, Shield, Truck, RotateCcw } from "lucide-react"
import { useCart } from "../../../pages/Cart/CartItem/context/CartContext"

export default function ProductInfo({ product, reviews }) {
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCart()

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    // if (newQuantity >= 1 && newQuantity <= product.stock) {
    //   setQuantity(newQuantity)
    // }
    setQuantity(newQuantity)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }
  const ratingStats = {
    total: reviews.length,
    average: reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
    distribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  const shouldBlink = ratingStats.average >= 4.5;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Product Title and Badge */}
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {product?.name}
          </h1>
          {product?.new && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-bounce">Mới</Badge>
          )}
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {product?.category?.name}
        </p>
      </div>

      {/* Price with Animation */}
      <div className="animate-slide-up animation-delay-100">
        <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
          {formatPrice(product?.price)}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {renderStars(ratingStats.average)}
          </div>
          <span className="text-sm text-gray-600">({ratingStats.average.toFixed(1) || "0.0"}/5 - {ratingStats.total} đánh giá) </span>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-sm animate-slide-up animation-delay-200">
        <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          {product?.description}
        </p>
      </div>

      {/* Quantity Selector with Enhanced Design */}
      <div className="flex items-center gap-4 animate-slide-up animation-delay-400">
        <span className="text-sm font-medium text-gray-700">Số lượng:</span>
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-colors duration-300">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-3 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-3 min-w-[80px] text-center font-semibold bg-gradient-to-r from-blue-50 to-purple-50">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-3 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons with Enhanced Effects */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up animation-delay-500">
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          disabled={product?.stock === 0}
          onClick={() => { addToCart({ ...product, quantity }) }}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Thêm vào giỏ hàng
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={`flex-1 transition-all duration-300 transform hover:scale-105 ${isLiked ? "bg-red-50 border-red-500 text-red-600 hover:bg-red-100" : "bg-transparent hover:bg-gray-50"}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          {/* <Heart
            className={`w-5 h-5 mr-2 transition-all duration-300 ${isLiked ? "fill-red-500 text-red-500 animate-pulse" : shouldBlink ? "fill-red-500 text-red-500 animate-pulse" : ""}`}
          /> */}
          {isLiked ? "" : ""}
        </Button>
      </div>

      {/* Product Features with Icons */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border animate-slide-up animation-delay-600">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Đặc điểm nổi bật
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Thành phần tự nhiên
          </li>
          <li className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Hiệu quả cao
          </li>
          <li className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Không gây kích ứng da
          </li>
          <li className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Phù hợp mọi loại da
          </li>
        </ul>
      </div>

      {/* Service Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up animation-delay-700">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300 hover:scale-105">
          <Truck className="w-6 h-6 text-blue-600" />
          <div>
            <div className="font-semibold text-sm">Miễn phí vận chuyển</div>
            <div className="text-xs text-gray-500">Đơn hàng từ 500k</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300 hover:scale-105">
          <RotateCcw className="w-6 h-6 text-green-600" />
          <div>
            <div className="font-semibold text-sm">Đổi trả 30 ngày</div>
            <div className="text-xs text-gray-500">Miễn phí đổi trả</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-300 hover:scale-105">
          <Shield className="w-6 h-6 text-purple-600" />
          <div>
            <div className="font-semibold text-sm">Bảo hành chính hãng</div>
            <div className="text-xs text-gray-500">Cam kết chất lượng</div>
          </div>
        </div>
      </div>
    </div>
  )
}