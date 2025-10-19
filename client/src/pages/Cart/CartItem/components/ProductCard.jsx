"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [isHovered, setIsHovered] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = async () => {
        setIsAdding(true)
        addToCart(product)
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsAdding(false)
    }

    return (
        <Card
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isHovered ? "shadow-xl" : ""
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                    <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className={`w-full h-48 object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
                            }`}
                    />
                    {product.new && <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">New</Badge>}
                    <Button
                        size="icon"
                        variant="outline"
                        className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                            }`}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-medium line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-blue-600">${product.price}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                        <Button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className={`transition-all duration-300 ${isAdding ? "bg-green-500" : ""}`}
                            size="sm"
                        >
                            {isAdding ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Added!
                                </div>
                            ) : (
                                <>
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
