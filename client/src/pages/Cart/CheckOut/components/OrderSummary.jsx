"use client"

import { CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function OrderSummary({ orderData, formatPrice, onSubmit, isSubmitting, formData, isAuthenticated, paymentMethod, setPaymentMethod }) {
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [couponCode, setCouponCode] = useState("")
    const [decreaseByCoupon, setDecreaseByCoupon] = useState(0)
    useEffect(() => {
        const PAYMENT_METHODS = localStorage.getItem("paymentMethod")
        if (PAYMENT_METHODS) {
            setPaymentMethod(PAYMENT_METHODS)
        }
    }, [])
    if (!orderData || orderData.length === 0) {
        return (
            <Card className="sticky top-4 animate-in slide-in-from-right-5 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        THÔNG TIN ĐƠN HÀNG
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                    Không có sản phẩm nào trong giỏ hàng.
                </CardContent>
            </Card>
        );
    }

    const subtotal = orderData.reduce((total, item) => total + (item.price * item.quantity), 0);
    return (
        <>
            <Card className="sticky top-4 animate-in slide-in-from-right-5 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        THÔNG TIN ĐƠN HÀNG
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Tạm tính ({orderData?.length} sản phẩm)</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí giao hàng</span>
                            <span className="font-medium">{formData.province ? formatPrice(30000) : 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Khuyến mãi</span>
                            <span className="font-medium">-{formatPrice(decreaseByCoupon) || 0}</span>
                        </div>
                        <div
                            className="text-sm text-blue-600 underline cursor-pointer"
                            onClick={() => setShowCouponModal(true)}
                        >
                            Chọn hoặc nhập mã khuyến mãi
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng tiền</span>
                        <span className="text-red-600">{formatPrice(subtotal + (formData.province ? 30000 : 0) - (orderData?.discount || 0))}</span>
                    </div>
                    <div className="text-sm text-gray-600">(Đã bao gồm VAT nếu có)</div>

                    <Separator />

                    <div>
                        <h3 className="font-medium mb-3">Phương Thức Thanh Toán</h3>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-blue-50">
                            <input onChange={(e) => {
                                setPaymentMethod(e.target.value)
                                localStorage.setItem("paymentMethod", e.target.value)
                            }}
                                value={"cod"} type="radio" id="cod" name="payment" checked={paymentMethod === "cod"} className="text-blue-600" />
                            <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                                <Truck className="w-4 h-4" />
                                Thanh toán khi nhận hàng
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-blue-50 mt-3">
                            <input onChange={(e) => {
                                setPaymentMethod(e.target.value)
                                localStorage.setItem("paymentMethod", e.target.value)
                            }}
                                value={"onl"} type="radio" id="onl" name="payment" checked={paymentMethod === "onl"} className="text-blue-600" />
                            <Label htmlFor="onl" className="flex items-center gap-2 cursor-pointer">
                                <Truck className="w-4 h-4" />
                                Thanh toán online
                            </Label>
                        </div>
                    </div>

                    <Button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-lg transition-all duration-200 transform hover:scale-105"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </div>
                        ) : (
                            "ĐẶT HÀNG"
                        )}
                    </Button>

                    <div className="text-xs text-gray-600 text-center">
                        Nhấn "ĐẶT HÀNG" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản của Spa
                    </div>
                </CardContent>
            </Card>

            {/* Modal nhập mã khuyến mãi */}
            <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nhập mã khuyến mãi</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Nhập mã khuyến mãi..."
                        value={couponCode}
                        disabled={!isAuthenticated}
                        onChange={e => setCouponCode(e.target.value)}
                    />

                    {isAuthenticated ? (<DialogFooter>
                        <Button onClick={() => setShowCouponModal(false)}>Áp dụng</Button>
                    </DialogFooter>) : (
                        <div className="text-red-600 mt-2">
                            Bạn cần <a className="underline" onClick={() => {
                                localStorage.setItem("redirect_url", window.location.pathname)
                                window.location.href = import.meta.env.VITE_SERVER_API_V1 + "/auth/google"
                            }}>đăng nhập</a> để sử dụng mã khuyến mãi.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
