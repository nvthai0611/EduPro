"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Clock, Star, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { formatPrice } from "../../../utils/format"
import { getAllUserCoupons } from "../../../services/user/couponService"
import { useQuery } from "@tanstack/react-query"
import authService from "../../../services/auth/authService"



export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState("");
  const user = authService?.getUser();
  const { data: offersData, isLoading, refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getAllUserCoupons(user.UID),
    staleTime: 0,                      // luôn xem dữ liệu “cũ”
    refetchOnWindowFocus: true,        // tự refetch khi bạn quay lại tab
    refetchOnMount: "always",          // refetch mỗi lần component mount
  });
  console.log("offersData:", offersData);
  
  if (isLoading) {
    <div className="min-h-screen bg-gray-200 flex justify-center mt-14">
      <div className="w-full max-w-md bg-white shadow-lg relative min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  }
  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Đã sao chép mã giảm giá!")
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case false:
        return "bg-green-100 text-green-800"
      case true:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case false:
        return "Đang áp dụng"
      case true:
        return "Đã sử dụng"
    }
  }

  const getDaysLeft = (validUntil) => {
    const today = new Date()
    const endDate = new Date(validUntil)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">🎁 Ưu Đãi Của Bạn</CardTitle>
          <CardDescription className="text-orange-100">
            Khám phá những ưu đãi hấp dẫn dành riêng cho bạn
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {offersData?.map((offer, index) => (
          <Card
            key={offer.couponId}
            className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            {/* ――― 3. Overlay xám mờ */}
            {(offer.isUsed || getDaysLeft(offer.endDate) <= 0) && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-800">
                  {offer.isUsed ? "Đã sử dụng" : "Hết hạn"}
                </span>
              </div>
            )}
            <div className="relative">
              <img
                src={offer.image || "https://tse1.mm.bing.net/th/id/OIP.tZ07JzrgsoMIjnpP0WRStwHaDX?pid=Api&P=0&h=180"}
                alt={offer.code}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getStatusColor(offer.isUsed)}>{getStatusText(offer.isUsed)}</Badge>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-bold text-pink-600">{offer.category}</span>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{offer.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-pink-600">{offer.discount}</div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span
                        className={
                          !offer.endDate || getDaysLeft(offer.endDate) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {!offer.endDate
                          ? "Còn hạn"
                          : getDaysLeft(offer.endDate) > 0
                            ? `Còn ${getDaysLeft(offer.endDate)} ngày`
                            : "Hết hạn"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mã giảm giá:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-pink-100 text-pink-800 px-2 py-1 rounded font-mono text-sm">
                        {offer.code}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyCode(offer.code)} className="h-8 w-8 p-0">
                        {copiedCode === offer.code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Đơn tối thiểu:</span>
                    <span className="font-medium">{formatPrice(offer.minOrderAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
