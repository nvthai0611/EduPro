"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Calendar, Percent, DollarSign } from "lucide-react"

export default function CouponAssignModal({ user, coupons = [], isOpen, onClose, onAssign }) {
  const [selectedCouponId, setSelectedCouponId] = useState("")
  const [expireDate, setExpireDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCoupon = coupons?.find((c) => c._id === selectedCouponId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCouponId || !expireDate) return

    setIsSubmitting(true)
    try {
      await onAssign({
        userId: user._id,
        couponId: selectedCouponId,
        expireDate: new Date(expireDate),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDiscountValue = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }).format(coupon.discountValue)
    }
  }

  // Set default expire date to 30 days from now
  const defaultExpireDate = new Date()
  defaultExpireDate.setDate(defaultExpireDate.getDate() + 30)
  const defaultExpireDateString = defaultExpireDate.toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Tặng coupon cho khách hàng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Gift className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{user?.fullName || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">{user?.email || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Selection */}
          <div className="space-y-2">
            <Label htmlFor="coupon">Chọn mã coupon</Label>
            <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn coupon để tặng" />
              </SelectTrigger>
              <SelectContent>
                {coupons
                  ?.filter((c) => c?.isActive)
                  ?.map((coupon) => (
                    <SelectItem key={coupon?._id} value={coupon?._id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coupon?.code || "N/A"}</span>
                        <Badge variant="outline">
                          {coupon?.discountType === "percentage" ? (
                            <Percent className="h-3 w-3 mr-1" />
                          ) : (
                            <DollarSign className="h-3 w-3 mr-1" />
                          )}
                          {formatDiscountValue(coupon)}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) || []}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Coupon Details */}
          {selectedCoupon && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mã: {selectedCoupon?.code || "N/A"}</span>
                    <Badge>
                      {selectedCoupon?.discountType === "percentage" ? (
                        <Percent className="h-3 w-3 mr-1" />
                      ) : (
                        <DollarSign className="h-3 w-3 mr-1" />
                      )}
                      {formatDiscountValue(selectedCoupon)}
                    </Badge>
                  </div>
                  {selectedCoupon?.minOrderAmount && (
                    <div className="text-sm text-muted-foreground">
                      Đơn tối thiểu:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(selectedCoupon.minOrderAmount)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Đã sử dụng: {selectedCoupon?.usedCount || 0}/{selectedCoupon?.maxUses || "Không giới hạn"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expire Date */}
          <div className="space-y-2">
            <Label htmlFor="expireDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ngày hết hạn
            </Label>
            <Input
              id="expireDate"
              type="date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              placeholder={defaultExpireDateString}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={!selectedCouponId || !expireDate || isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Tặng coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
