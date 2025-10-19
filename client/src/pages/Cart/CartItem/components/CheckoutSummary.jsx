"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Truck } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"
import { formatPrice } from "../../../../utils/format.js"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function CheckoutSummary() {
    const { cart, getCartTotal, getSelectedItems } = useCart()
    const selectedItems = getSelectedItems()
    const subtotal = getCartTotal()
    const shippingFee = selectedItems.length > 0 ? cart.shippingFee : 0
    const total = subtotal
    const navigate = useNavigate()
    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error("Vui lòng chọn sản phẩm để đặt hàng.")
            return
        }
        // Redirect to checkout page or handle checkout logic here
        navigate("/shop/checkout")
    }

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Tổng tiền tạm tính
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Số sản phẩm ({selectedItems.length})</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    {/* <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Shipping
                        </span>
                        <span>${shippingFee.toFixed(2)}</span>
                    </div> */}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                    <span>Tổng tiền</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                </div>

                <Button className="w-full" onClick={handleCheckout} disabled={selectedItems.length === 0}>
                    Tiến hành đặt hàng ({selectedItems.length} sản phẩm)
                </Button>
                <p className="text-xs text-gray-500 text-center">Không ưng đổi ngay trong 30 ngày</p>
                <p className="text-xs text-gray-500 text-center">Miễn phí vận chuyển cho đơn hàng trên 1.500.000 VND</p>
            </CardContent>
        </Card>
    )
}
