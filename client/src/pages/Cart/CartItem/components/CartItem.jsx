"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"
import { formatPrice } from "../../../../utils/format.js"
import { useNavigate } from "react-router-dom"

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart, toggleItemSelection } = useCart()
    const [isRemoving, setIsRemoving] = useState(false)
    const navigate = useNavigate()

    const handleRemove = async () => {
        setIsRemoving(true)
        await new Promise((resolve) => setTimeout(resolve, 300))
        await removeFromCart(item.product._id)
    }

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity <= 0) {
            handleRemove()
        } else {
            updateQuantity(item.product._id, newQuantity)
        }
    }

    return (
        <Card className={`transition-all duration-300 ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="max-h-max">
                        <Checkbox
                            checked={item.selected || false}
                            onCheckedChange={() => toggleItemSelection(item.product._id)}
                            className="mt-2 bg-gray-300 hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 rounded-md h-5 w-5 flex items-center justify-center"
                        />
                    </div>

                    <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                        <img
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            loading="lazy"
                            onClick={() => navigate(`/shop/${item.product._id}`)}
                            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{item.product.description}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRemove}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</div>
                                <div className="text-xs text-gray-500">{formatPrice(item.price)}/sản phẩm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}
