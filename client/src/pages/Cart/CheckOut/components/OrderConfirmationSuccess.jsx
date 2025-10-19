"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle, Package, Truck, Clock, MapPin, CreditCard, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCheckoutByUserId } from "../../../../services/user/cartService"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { formatPrice } from "../../../../utils/format"
import socketService from "../../../../utils/socket" // Đã thay đổi import thành socketService
import authService from "../../../../services/auth/authService"

// Add this right after the imports and before the orderData
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
    animation-delay: 1s;
  }
  
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
`

const deliveryTimeLabels = {
    standard: "Giao hàng tiêu chuẩn (5-7 ngày)",
    allday: "Giao hàng cả ngày (3-4 ngày)",
    fastdelivery: "Giao hàng nhanh (1-2 ngày)",
}

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
}

export default function OrderConfirmationSuccess() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [searchParams] = useSearchParams()
    const isAuthenticated = authService.isAuthenticated()
    const [orderData, setOrderData] = useState({})
    const [loading, setLoading] = useState(true)
    // hasEmittedRef sẽ đảm bảo sự kiện chỉ được gửi một lần cho mỗi lần tải trang component
    const hasEmittedRef = useRef(false)
    const orderCode = searchParams.get("orderCode")
    const status = searchParams.get("status")

    const navigate = useNavigate()

    // Effect cho animation và kiểm tra xác thực người dùng
    useEffect(() => {
        if (isAuthenticated) {
            setIsVisible(true)
            const timer = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % 4)
            }, 3000)
            return () => clearInterval(timer)
        } else {
            toast.error("Vui lòng đăng nhập trên trang web")
            setTimeout(() => {
                navigate("/")
            }, 1500)
        }
    }, [isAuthenticated, navigate])

    // Effect để lấy dữ liệu đơn hàng và gửi sự kiện socket
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const result = await getCheckoutByUserId(orderCode)
                if (result.success) {
                    setOrderData(result.data)
                    console.log("Frontend: Fetched order data:", result.data);
                    // Logic gửi sự kiện socket:
                    // 1. Chỉ gửi nếu status là "PAID"
                    // 2. Chỉ gửi nếu có orderId (result.data._id)
                    // 3. Quan trọng nhất: Chỉ gửi nếu hasEmittedRef.current là false.
                    //    Điều này ngăn chặn việc gửi trùng lặp do React Strict Mode hoặc re-renders.
                    if (status === "PAID" && result?.data?._id && !hasEmittedRef.current) {
                        console.log("Frontend: Emitting 'new_order' event with data:", {
                            orderId: result?.data?._id,
                            orderCode: result?.data?.orderCode,
                            userName: result?.data?.UserId?.fullName,
                            amount: result?.data?.totalAmount || result?.data?.amount || 0,
                            createdAt: result?.data?.createdAt || new Date().toISOString()
                        });
                        socketService.emit("new_order", { // Sử dụng socketService.emit
                            orderId: result?.data?._id,
                            orderCode: result?.data?.orderCode,
                            userName: result?.data?.UserId?.fullName,
                            amount: result?.data?.totalAmount || result?.data?.amount || 0,
                            createdAt: result?.data?.createdAt || new Date().toISOString()
                        })
                        hasEmittedRef.current = true // Đặt ref thành true sau khi đã gửi
                    }
                    // COD
                    if (status === "PENDING" && result?.data?._id && !hasEmittedRef.current) {
                        console.log("Frontend: Emitting 'new_order' COD");
                        socketService.emit("new_order", {
                            orderId: result.data._id,
                            orderCode: result.data.orderCode,
                            userName: result?.data?.UserId?.fullName,
                            amount: result?.data?.totalAmount || result?.data?.amount || 0,
                            createdAt: result?.data?.createdAt || new Date().toISOString()
                        });
                        hasEmittedRef.current = true // Đặt ref thành true sau khi đã gửi
                    }
                } else {
                    toast.error(result.message)
                    setOrderData({})
                }
            } catch (error) {
                console.error("Error fetching checkout data:", error)
                toast.error("Có lỗi xảy ra khi tải dữ liệu đơn hàng.")
                setOrderData({})
            } finally {
                setLoading(false)
            }
        }

        // Gọi fetchData chỉ khi có orderCode
        if (orderCode) {
            fetchData()
        } else {
            setLoading(false)
            toast.error("Không tìm thấy mã đơn hàng.")
        }
    }, [orderCode, status]) // Thêm 'status' vào dependencies để useEffect chạy lại nếu status thay đổi

    const steps = [
        { icon: CreditCard, label: orderData.statusOrder === "paid" ? "Thanh toán đã được xác nhận" : "Thanh toán khi nhận hàng", active: true },
        { icon: Package, label: "Xử lý đơn hàng", active: orderData.statusOrder === "paidd" },
        { icon: Truck, label: "Đã vận chuyển", active: orderData.statusShipping === "shipped" },
        { icon: CheckCircle, label: "Đã giao hàng", active: orderData.statusShipping === "delivered" },
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16 flex items-center justify-center">
                <p className="text-xl text-gray-700">Đang tải chi tiết đơn hàng...</p>
            </div>
        )
    }

    if (!orderData || Object.keys(orderData).length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy đơn hàng hoặc có lỗi xảy ra!</h1>
            </div>
        )
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div
                        className={`text-center mb-8 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Đơn hàng đã được xác nhận!</h1>
                        <p className="text-lg text-gray-600">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được đặt thành công.
                        </p>
                        <div className="mt-4">
                            <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
                                Đơn hàng #{orderData?.orderCode}
                            </Badge>
                        </div>
                    </div>

                    {/* Order Status Timeline */}
                    <Card
                        className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} overflow-hidden`}
                    >
                        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                Trạng thái đơn hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="relative">
                                {/* Progress Line Background */}
                                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 rounded-full"></div>

                                {/* Active Progress Line */}
                                <div
                                    className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-2000 ease-out"
                                    style={{
                                        width: `${(steps.filter((step) => step.active).length - 1) * (100 / (steps.length - 1))}%`,
                                    }}
                                ></div>

                                {/* Steps Container */}
                                <div className="relative flex justify-between">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon
                                        const isActive = step.active
                                        const isCurrent = index === currentStep && isActive
                                        const isCompleted = isActive && index < steps.filter((s) => s.active).length - 1

                                        return (
                                            <div key={index} className="flex flex-col items-center z-10">
                                                {/* Step Circle */}
                                                <div
                                                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 transform ${isActive
                                                        ? isCurrent
                                                            ? "bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 shadow-xl animate-pulse"
                                                            : isCompleted
                                                                ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg"
                                                                : "bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-md"
                                                        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400"
                                                        } hover:scale-105`}
                                                >
                                                    <Icon className="w-6 h-6" />

                                                    {/* Ripple Effect for Current Step */}
                                                    {isCurrent && (
                                                        <>
                                                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
                                                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-10 animation-delay-200"></div>
                                                        </>
                                                    )}

                                                    {/* Checkmark for Completed Steps */}
                                                    {isCompleted && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Step Label */}
                                                <div className="mt-4 text-center max-w-24">
                                                    <span
                                                        className={`text-sm font-medium transition-all duration-500 ${isActive
                                                            ? isCurrent
                                                                ? "text-green-600 font-bold"
                                                                : "text-green-700 font-semibold"
                                                            : "text-gray-400"
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </span>

                                                    {/* Status Indicator */}
                                                    {isActive && (
                                                        <div className="mt-1">
                                                            <div
                                                                className={`inline-block w-2 h-2 rounded-full ${isCurrent ? "bg-green-400 animate-pulse" : "bg-green-500"
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Estimated Time (for active steps) */}
                                                {isActive && (
                                                    <div className="mt-2 text-xs text-gray-500 text-center opacity-0 animate-fade-in">
                                                        {index === 0 && "Hoàn thành"}
                                                        {index === 1 && "Xử lý..."}
                                                        {index === 2 && "1-2 ngày"}
                                                        {index === 3 && "Đã giao hàng"}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Floating Status Badge */}
                                <div className="mt-8 flex justify-center">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="font-medium">
                                                {orderData.statusOrder === "paid" ? "Đơn hàng đã được xác nhận và đang xử lý" : "Trạng thái đơn hàng đã được cập nhật"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <Card
                            className={`transform transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Đặt hàng các mặt hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {orderData?.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-4 p-3 rounded-lg bg-gray-50 transform transition-all duration-500 hover:scale-105 hover:shadow-md`}
                                        style={{ animationDelay: `${index * 200}ms` }}
                                    >
                                        <img
                                            src={item?.product?.images[0] || "/placeholder.svg"}
                                            alt={item?.product?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatPrice((item.price * item.quantity))}</p>
                                            <p className="text-sm text-gray-600">{formatPrice(item.price)} </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card
                            className={`transform transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Tóm tắt đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Tổng phụ</span>
                                        <span>{formatPrice((orderData.totalAmount - orderData.shippingFee))}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển</span>
                                        <span>{formatPrice(orderData.shippingFee)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Tổng tiền</span>
                                        <span className="text-green-600">{formatPrice(orderData?.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge className={statusColors[orderData?.statusOrder]}>
                                            {orderData?.statusOrder?.charAt(0)?.toUpperCase() + orderData?.statusOrder?.slice(1)}
                                        </Badge>
                                        <Badge className={statusColors[orderData?.statusShipping]}>
                                            {orderData?.statusShipping?.charAt(0)?.toUpperCase() + orderData?.statusShipping?.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{deliveryTimeLabels[orderData?.deliveryTime]}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shipping Information */}
                    <Card
                        className={`mt-8 transform transition-all duration-1000 delay-900 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Thông tin vận chuyển
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-2">Địa chỉ giao hàng</h4>
                                <p className="text-gray-600 leading-relaxed">{orderData.shippingAddress}</p>
                            </div>

                            {orderData.note && (
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Hướng dẫn đặc biệt
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">{orderData.note}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div
                        className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-1100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        <Button onClick={() => navigate(`/`)} size="lg" className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
                            Quay trở về trang chủ
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="outline"
                            onClick={() => {
                                navigate("/shop")
                                window.scrollTo(0, "smooth")
                            }}
                            size="lg" className="transition-all duration-300 hover:scale-105 bg-transparent">
                            Tiếp tục mua sắm
                        </Button>
                    </div>

                    {/* Order Date */}
                    <div
                        className={`mt-8 text-center text-sm text-gray-500 transform transition-all duration-1000 delay-1300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        Đơn hàng đã đặt vào{" "}
                        {new Date(orderData.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}