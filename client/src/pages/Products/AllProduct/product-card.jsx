"use client"

import { Star, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "../../../utils/format"
import { useNavigate } from "react-router-dom"

export default function ProductCard({ product, getCategoryName, onViewReviews }) {
  const navigate = useNavigate()
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onClick={() => {
              navigate(`/shop/${product._id}`)
              window.scrollTo(0, 'smooth')
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600">{getCategoryName(product?.category?._id)}</Badge>
            {product.new && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-bounce">
                Mới
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">
          {product.name.length > 27
            ? product.name.substring(0, 27).trim() + '...'
            : product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2"> {product?.description?.length > 35
          ? product.name.substring(0, 35).trim() + '...'
          : product.name}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product?.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product?.rating} ({product?.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{formatPrice(product?.price)}</span>
          {/* <span className="text-sm text-gray-500">
            {product?.stock > 0 ? `${product?.stock} available` : "Out of stock"}
          </span> */}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onViewReviews(product)}>
          <Eye className="h-4 w-4 mr-2" />
          View Reviews
        </Button> */}

        <Button size="sm" onClick={() => {
          navigate(`/shop/${product._id}`)
          window.scrollTo(0, 'smooth')
        }} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={product.stock === 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
