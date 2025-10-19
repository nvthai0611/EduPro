"use client"
import Breadcrumb from "./Breadcrumb"
import DeliveryInformation from "./DeliveryInformation"
import DeliveryTime from "./DeliveryTime"
import OrderNotes from "./OrderNotes"
import ProductList from "./ProductList"
import OrderSummary from "./OrderSummary"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { formatPrice } from "../../../../utils/format"
import { orderData } from "../data/mock-data"
import { useState } from "react"
import { useCart } from "../../../../pages/Cart/CartItem/context/CartContext"
import { checkoutSelectedItems, createPayosPaymentLink } from "../../../../services/user/cartService"
import { toast, ToastContainer } from "react-toastify"
import { Button } from "@/components/ui/button"
import { isValidName, isValidPhone, isValidEmail } from "../../../../utils/validation"
import { useNavigate } from "react-router-dom"
import socket from "../../../../utils/socket"

const LOCAL_STORAGE_KEY = 'UserInformationCheckOut';
export default function PaymentPage() {
    const { cart, isAuthenticated } = useCart()
    // lay nhu cai da selected trong cart
    const cartSelect = cart.items.filter((item) => item.selected === true)
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [showLoginModal, setShowLoginModal] = useState(false)
    const navigate = useNavigate()

    const [error, setError] = useState({
        fullName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        address: "",
    })
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        shippingFee: 30000,
        deliveryTime: "standard",
        note: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        setError((prev) => ({
            ...prev,
            [field]: "",
        }))
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...formData, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            setShowLoginModal(true)
            return
        }

        // Validate từng trường
        let newError = {
            fullName: "",
            phone: "",
            email: "",
            province: "",
            district: "",
            ward: "",
            address: "",
        }
        let hasError = false;
        if (!formData.fullName) {
            newError.fullName = "Vui lòng nhập tên";
            hasError = true;
        } else if (!isValidName(formData.fullName)) {
            newError.fullName = "Tên không hợp lệ";
            hasError = true;
        }
        if (!formData.phone) {
            newError.phone = "Vui lòng nhập số điện thoại";
            hasError = true;
        } else if (!isValidPhone(formData.phone)) {
            newError.phone = "Số điện thoại không hợp lệ";
            hasError = true;
        }
        if (!formData.email) {
            newError.email = "Vui lòng nhập email";
            hasError = true;
        } else if (!isValidEmail(formData.email)) {
            newError.email = "Email không hợp lệ";
            hasError = true;
        }
        if (!formData.province) {
            newError.province = "Vui lòng chọn tỉnh thành";
            hasError = true;
        }
        if (!formData.district) {
            newError.district = "Vui lòng chọn quận huyện";
            hasError = true;
        }
        if (!formData.ward) {
            newError.ward = "Vui lòng chọn phường xã";
            hasError = true;
        }
        if (!formData.address) {
            newError.address = "Vui lòng nhập địa chỉ";
            hasError = true;
        }
        if (hasError) {
            setError(newError)
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
            return
        }
        setIsSubmitting(true)
        // Simulate API call
        const newFormdata = {
            ...formData,
            shippingAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
            items: cartSelect.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
            })),
        }
        const totalAmount = cartSelect.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        try {
            if (paymentMethod === "cod") {
                const response = await checkoutSelectedItems(newFormdata)
                if (!response.success) {
                    toast.error("Đặt hàng thất bại")
                    setIsSubmitting(false)
                }
                if (response.success) {
                    setIsSubmitting(false)
                    toast.success("Đặt hàng thành công")

                    setTimeout(() => {
                        window.location.replace(`/shop/success?code=01&id=${response.data._id}&cancel=false&status=PENDING&orderCode=${response.data.orderCode}`)
                    }, 1000)
                }
            }

            if (paymentMethod === "onl") {
                // const response = await apiClient.post("/payos/payment");
                const response = await createPayosPaymentLink(newFormdata, 'product')
                if (!response.success) {
                    setIsSubmitting(false)
                    toast.error("Đặt hàng thất bại")
                }
                if (response.success) {
                    window.location.href = response.data;
                }
            }
        } catch (error) {
            setIsSubmitting(false)
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">THANH TOÁN</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <DeliveryInformation formData={formData} onInputChange={handleInputChange} error={error} />

                        <DeliveryTime formData={formData} onInputChange={handleInputChange} />

                        <OrderNotes formData={formData} onInputChange={handleInputChange} />

                        <ProductList products={cartSelect} formatPrice={formatPrice} />
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            orderData={cartSelect}
                            formatPrice={formatPrice}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            formData={formData}
                            isAuthenticated={isAuthenticated}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                    </div>
                </div>
            </div>
            <Dialog open={showLoginModal} onOpenChange={() => setShowLoginModal(false)}>
                <DialogContent className="sm:max-w-md animate-fade-in rounded-xl shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-blue-600 text-xl font-semibold">
                            Bạn chưa đăng nhập
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center text-gray-600 mb-4">
                        Vui lòng đăng nhập để tiếp tục thanh toán.
                    </div>
                    <DialogFooter className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                            Để sau
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                localStorage.setItem("redirect_url", window.location.pathname)
                                window.location.href = import.meta.env.VITE_SERVER_API_V1 + "/auth/google"
                            }}>
                            Đăng nhập
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
