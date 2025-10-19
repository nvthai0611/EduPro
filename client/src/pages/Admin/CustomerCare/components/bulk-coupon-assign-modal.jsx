import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Calendar, Percent, DollarSign, Users, Send, AlertTriangle, CheckCircle } from "lucide-react"

// Component riêng cho CouponSelect để tránh re-render issues
const CouponSelect = ({ coupons, value, onValueChange }) => {
    const activeCoupons = useMemo(() => {
        return coupons.filter((c) => c.isActive)
    }, [coupons])

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder="Chọn coupon để gửi" />
            </SelectTrigger>
            <SelectContent>
                {activeCoupons.map((coupon) => {
                    const discountDisplay = coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                        }).format(coupon.discountValue)

                    return (
                        <SelectItem key={coupon._id} value={coupon._id}>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{coupon.code}</span>
                                <Badge variant="outline">
                                    {coupon.discountType === "percentage" ? (
                                        <Percent className="h-3 w-3 mr-1" />
                                    ) : (
                                        <DollarSign className="h-3 w-3 mr-1" />
                                    )}
                                    {discountDisplay}
                                </Badge>
                            </div>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

export default function BulkCouponAssignModal({ users, coupons, userTypeStats, isOpen, onClose, onAssign }) {
    const [assignmentData, setAssignmentData] = useState({
        selectedUserTypes: [], // ['normal', 'loyal', 'VIP']
        selectedCouponId: "",
        expireDate: "",
        sendEmail: true,
        emailSubject: "Bạn đã nhận được coupon mới!",
        emailMessage:
            "Bạn đã nhận được một coupon mới từ chúng tôi. Hãy sử dụng ngay để nhận ưu đãi!",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedCoupon = useMemo(() => {
        return coupons.find((c) => c._id === assignmentData.selectedCouponId)
    }, [coupons, assignmentData.selectedCouponId])

    // Calculate affected users
    const affectedUsers = useMemo(() => {
        if (assignmentData.selectedUserTypes.length === 0) return []
        return users.filter((user) => assignmentData.selectedUserTypes.includes(user.type))
    }, [users, assignmentData.selectedUserTypes])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalAffected = affectedUsers.length
        const byType = assignmentData.selectedUserTypes.reduce((acc, type) => {
            acc[type] = users.filter((u) => u.type === type).length
            return acc
        }, {})

        return { totalAffected, byType }
    }, [affectedUsers, assignmentData.selectedUserTypes, users])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (
            assignmentData.selectedUserTypes.length === 0 ||
            !assignmentData.selectedCouponId ||
            !assignmentData.expireDate
        ) {
            return
        }

        setIsSubmitting(true)
        try {
            await onAssign({
                ...assignmentData,
                affectedUsers,
                stats,
            })

        } finally {
            setIsSubmitting(false)
        }
    }, [assignmentData, affectedUsers, stats, onAssign]) // Thêm dependencies

    const getUserTypeLabel = useCallback((type) => {
        switch (type) {
            case "VIP":
                return "VIP"
            case "loyal":
                return "Thân thiết"
            default:
                return "Thường"
        }
    }, []) // Không có dependencies

    const getUserTypeColor = useCallback((type) => {
        switch (type) {
            case "VIP":
                return "bg-purple-100 text-purple-800"
            case "loyal":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }, []) // Không có dependencies

    const handleToggleUserType = useCallback((type) => {
        setAssignmentData((prev) => ({
            ...prev,
            selectedUserTypes: prev.selectedUserTypes.includes(type)
                ? prev.selectedUserTypes.filter((t) => t !== type)
                : [...prev.selectedUserTypes, type],
        }))
    }, []) // Empty dependency array because prev is used

    const selectAllUserTypes = useCallback(() => {
        setAssignmentData((prev) => ({
            ...prev,
            selectedUserTypes: ["normal", "loyal", "VIP"],
        }))
    }, []) // Empty dependency array because prev is used

    const deselectAllUserTypes = useCallback(() => {
        setAssignmentData((prev) => ({
            ...prev,
            selectedUserTypes: [],
        }))
    }, []) // Empty dependency array because prev is used

    const handleCouponSelect = useCallback((value) => {
        setAssignmentData((prev) => ({ ...prev, selectedCouponId: value }))
    }, []) // Empty dependency array because prev is used

    // Set default expire date to 30 days from now
    const defaultExpireDateString = useMemo(() => {
        const defaultExpireDate = new Date()
        defaultExpireDate.setDate(defaultExpireDate.getDate() + 30)
        return defaultExpireDate.toISOString().split("T")[0]
    }, [])

    const userTypeOptions = useMemo(() => [
        { type: "normal", label: "Thường", count: userTypeStats?.normal || 0 },
        { type: "loyal", label: "Thân thiết", count: userTypeStats?.loyal || 0 },
        { type: "VIP", label: "VIP", count: userTypeStats?.VIP || 0 },
    ], [userTypeStats])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        Gửi coupon hàng loạt theo loại người dùng
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Type Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Chọn loại người dùng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={selectAllUserTypes}>
                                    Chọn tất cả
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={deselectAllUserTypes}>
                                    Bỏ chọn tất cả
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {userTypeOptions.map(({ type, label, count }) => (
                                    <div
                                        key={type}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${assignmentData.selectedUserTypes.includes(type)
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    // Đã xóa onClick khỏi div cha để chỉ dùng onCheckedChange của Checkbox
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                checked={assignmentData.selectedUserTypes.includes(type)}
                                                onCheckedChange={() => handleToggleUserType(type)} // Đây là trình xử lý duy nhất
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <Badge className={getUserTypeColor(type)}>{label}</Badge>
                                                    <div className="text-2xl font-bold">{count}</div>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">người dùng</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            {assignmentData.selectedUserTypes.length > 0 && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium text-blue-800">Tổng kết lựa chọn</span>
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        Sẽ gửi coupon cho <span className="font-bold">{stats.totalAffected}</span> người dùng:
                                        {Object.entries(stats.byType).map(([type, count]) => (
                                            <span key={type} className="ml-2">
                                                {getUserTypeLabel(type)}: {count}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Coupon Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="h-5 w-5" />
                                Chọn coupon
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="coupon">Mã coupon</Label>
                                <CouponSelect
                                    coupons={coupons}
                                    value={assignmentData.selectedCouponId}
                                    onValueChange={handleCouponSelect}
                                />
                            </div>

                            {/* Selected Coupon Details */}
                            {selectedCoupon && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Mã: {selectedCoupon.code}</span>
                                            <Badge>
                                                {selectedCoupon.discountType === "percentage" ? (
                                                    <Percent className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                )}
                                                {selectedCoupon.discountType === "percentage"
                                                    ? `${selectedCoupon.discountValue}%`
                                                    : new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                        minimumFractionDigits: 0,
                                                    }).format(selectedCoupon.discountValue)
                                                }
                                            </Badge>
                                        </div>
                                        {selectedCoupon.minOrderAmount && (
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
                                            Đã sử dụng: {selectedCoupon.usedCount}/{selectedCoupon.maxUses || "Không giới hạn"}
                                        </div>
                                    </div>
                                </div>
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
                                    value={assignmentData.expireDate}
                                    onChange={(e) => setAssignmentData((prev) => ({ ...prev, expireDate: e.target.value }))}
                                    min={new Date().toISOString().split("T")[0]}
                                    placeholder={defaultExpireDateString}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Notification */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Thông báo email
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={assignmentData.sendEmail}
                                    onCheckedChange={(checked) => setAssignmentData((prev) => ({ ...prev, sendEmail: checked }))}
                                />
                                <Label>Gửi email thông báo cho người dùng</Label>
                            </div>

                            {assignmentData.sendEmail && (
                                <div className="space-y-4 ml-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="emailSubject">Tiêu đề email</Label>
                                        <Input
                                            id="emailSubject"
                                            value={assignmentData.emailSubject}
                                            onChange={(e) => setAssignmentData((prev) => ({ ...prev, emailSubject: e.target.value }))}
                                            placeholder="Nhập tiêu đề email..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="emailMessage">Nội dung email</Label>
                                        <Textarea
                                            id="emailMessage"
                                            value={assignmentData.emailMessage}
                                            onChange={(e) => setAssignmentData((prev) => ({ ...prev, emailMessage: e.target.value }))}
                                            placeholder="Nhập nội dung email..."
                                            rows={6}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Warning */}
                    {stats.totalAffected > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <span className="font-medium text-yellow-800">Xác nhận hành động</span>
                            </div>
                            <div className="text-sm text-yellow-700 mt-1">
                                Bạn sắp gửi coupon <strong>{selectedCoupon?.code}</strong> cho <strong>{stats.totalAffected}</strong>{" "}
                                người dùng. Hành động này không thể hoàn tác.
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                assignmentData.selectedUserTypes.length === 0 ||
                                !assignmentData.selectedCouponId ||
                                !assignmentData.expireDate
                            }
                        >
                            <Gift className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Đang gửi..." : `Gửi cho ${stats.totalAffected} người dùng`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}