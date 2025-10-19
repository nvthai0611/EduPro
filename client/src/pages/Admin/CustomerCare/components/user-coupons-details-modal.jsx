"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    User,
    Gift,
    Calendar,
    Percent,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Mail,
    Star,
} from "lucide-react"

export default function UserCouponsDetailsModal({ userGroup, isOpen, onClose }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200"
            case "expiring":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "expired":
                return "bg-red-100 text-red-800 border-red-200"
            case "used":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case "active":
                return "Hoạt động"
            case "expiring":
                return "Sắp hết hạn"
            case "expired":
                return "Đã hết hạn"
            case "used":
                return "Đã sử dụng"
            default:
                return status
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-4 w-4" />
            case "expiring":
                return <AlertTriangle className="h-4 w-4" />
            case "expired":
                return <XCircle className="h-4 w-4" />
            case "used":
                return <Gift className="h-4 w-4" />
            default:
                return null
        }
    }

    const formatDiscountValue = (coupon) => {
        if (!coupon) return "N/A"
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

    const getUserTypeLabel = (type) => {
        switch (type) {
            case "VIP":
                return "VIP"
            case "loyal":
                return "Thân thiết"
            default:
                return "Thường"
        }
    }

    const getUserTypeColor = (type) => {
        switch (type) {
            case "VIP":
                return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            case "loyal":
                return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    console.log(userGroup);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Gift className="h-6 w-6 text-blue-600" />
                        Chi tiết coupons của khách hàng
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* User Information */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Thông tin khách hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {userGroup?.user?.fullName?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{userGroup?.user?.fullName || "N/A"}</div>
                                    <Badge className={getUserTypeColor(userGroup?.user?.type)} variant="secondary">
                                        <Star className="h-3 w-3 mr-1" />
                                        {getUserTypeLabel(userGroup?.user?.type)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Email:</span>
                                    <span>{userGroup?.user?.email || "N/A"}</span>
                                </div>
                                <div className="text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium">Số điện thoại:</span> {userGroup?.user?.phoneNumber || "N/A"}
                                </div>
                                <div className="text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium">Ngày tham gia:</span>{" "}
                                    {userGroup?.user?.createdAt ? new Date(userGroup.user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coupon Statistics */}
                    <Card className="md:col-span-2 border-l-4 border-l-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="h-5 w-5" />
                                Thống kê coupons
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                                    <div className="text-3xl font-bold text-gray-600">{userGroup?.totalCoupons || 0}</div>
                                    <div className="text-sm text-gray-700 font-medium">Tổng coupons</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                    <div className="text-3xl font-bold text-green-600">{userGroup?.activeCoupons || 0}</div>
                                    <div className="text-sm text-green-700 font-medium">Hoạt động</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                                    <div className="text-3xl font-bold text-yellow-600">{userGroup?.expiringCoupons || 0}</div>
                                    <div className="text-sm text-yellow-700 font-medium">Sắp hết hạn</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600">{userGroup?.usedCoupons || 0}</div>
                                    <div className="text-sm text-blue-700 font-medium">Đã sử dụng</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coupons List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="h-5 w-5" />
                            Danh sách coupons ({userGroup?.coupons?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Mã coupon</TableHead>
                                        <TableHead className="font-semibold">Giá trị</TableHead>
                                        <TableHead className="font-semibold">Trạng thái</TableHead>
                                        <TableHead className="font-semibold">Ngày tặng</TableHead>
                                        <TableHead className="font-semibold">Ngày hết hạn</TableHead>
                                        <TableHead className="font-semibold">Còn lại</TableHead>
                                        <TableHead className="font-semibold">Sử dụng</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userGroup?.coupons?.map((coupon) => (
                                        <TableRow key={coupon._id} className="hover:bg-gray-50">
                                            {/* Mã coupon */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium text-blue-600">{coupon.couponId?.code || "N/A"}</div>
                                                    {coupon.coupon?.minOrderAmount && (
                                                        <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                                            Tối thiểu:{" "}
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                                minimumFractionDigits: 0,
                                                            }).format(coupon.couponId?.minOrderAmount)}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            {/* Giá trị */}
                                            <TableCell>
                                                <Badge variant="outline" className="font-semibold">
                                                    {coupon.coupon?.discountType === "percentage" ? (
                                                        <Percent className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <DollarSign className="h-3 w-3 mr-1" />
                                                    )}
                                                    {formatDiscountValue(coupon.couponId)}
                                                </Badge>
                                            </TableCell>
                                            {/* Trạng thái */}
                                            <TableCell>
                                                <Badge className={getStatusColor(coupon.status)} variant="secondary">
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(coupon.status)}
                                                        {getStatusLabel(coupon.status)}
                                                    </div>
                                                </Badge>
                                            </TableCell>
                                            {/* Ngày tặng */}
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {coupon.createdAt ? new Date(coupon.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                                </div>
                                            </TableCell>
                                            {/* Ngày hết hạn */}
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(coupon.expireDate).toLocaleDateString("vi-VN")}
                                                </div>
                                            </TableCell>
                                            {/* Còn lại */}
                                            <TableCell>
                                                <div
                                                    className={`text-sm font-medium px-2 py-1 rounded ${coupon.daysUntilExpire < 0
                                                        ? "bg-red-100 text-red-600"
                                                        : coupon.daysUntilExpire <= 7
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {coupon.daysUntilExpire < 0
                                                        ? `Quá hạn ${Math.abs(coupon.daysUntilExpire)} ngày`
                                                        : `${coupon.daysUntilExpire} ngày`}
                                                </div>
                                            </TableCell>
                                            {/* Sử dụng */}
                                            <TableCell>
                                                {coupon.isUsed ? (
                                                    <div className="text-sm">
                                                        <div className="text-green-600 font-medium flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4" />
                                                            Đã sử dụng
                                                        </div>
                                                        {coupon.usedAt && (
                                                            <div className="text-muted-foreground text-xs">
                                                                {new Date(coupon.usedAt).toLocaleDateString("vi-VN")}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">Chưa sử dụng</div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )) || []}
                                </TableBody>
                            </Table>
                        </div>

                        {userGroup?.coupons?.length === 0 && (
                            <div className="text-center py-12">
                                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <div className="text-lg font-medium text-gray-600">Chưa có coupon nào</div>
                                <div className="text-sm text-muted-foreground">Khách hàng này chưa được tặng coupon</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Usage Guidelines */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Hướng dẫn sử dụng coupon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 text-sm text-blue-700">
                                <p>• Mỗi coupon chỉ có thể sử dụng một lần</p>
                                <p>• Kiểm tra ngày hết hạn trước khi sử dụng</p>
                                <p>• Một số coupon có giá trị đơn hàng tối thiểu</p>
                                <p>• Hệ thống tự động nhắc nhở khi coupon sắp hết hạn</p>
                            </div>
                            <div className="space-y-2 text-sm text-blue-700">
                                <p>• Không thể kết hợp nhiều coupon trong một đơn hàng</p>
                                <p>• Coupon không thể hoàn lại sau khi sử dụng</p>
                                <p>• Liên hệ hỗ trợ nếu gặp vấn đề khi sử dụng</p>
                                <p>• Coupon VIP có giá trị cao hơn coupon thường</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
