"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, User, Calendar, Send, Users, Gift } from "lucide-react"

export default function EmailReminderModal({ userGroup, userGroups = [], isOpen, onClose, onSend }) {
    const [emailData, setEmailData] = useState({
        subject: userGroup
            ? `Nhắc nhở: Bạn có ${userGroup.expiringCoupons + userGroup.activeCoupons} coupon sắp hết hạn!`
            : "Nhắc nhở: Các coupon của bạn sắp hết hạn!",
        message: userGroup
            ? `Xin chào ${userGroup.user?.fullName},\n\nBạn có ${userGroup.totalCoupons} coupon, trong đó ${userGroup.expiringCoupons} coupon sắp hết hạn và ${userGroup.activeCoupons} coupon đang hoạt động.\n\nHãy sử dụng ngay để không bỏ lỡ ưu đãi này!\n\nTrân trọng,\nĐội ngũ hỗ trợ`
            : `Xin chào,\n\nBạn có các coupon sắp hết hạn. Hãy sử dụng ngay để không bỏ lỡ ưu đãi!\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
        sendImmediately: true,
        scheduleDate: "",
        scheduleTime: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedRecipients, setSelectedRecipients] = useState(
        userGroups.length > 0 ? userGroups.map((ug) => ug.user?._id) : [],
    )

    const isBulkEmail = userGroups.length > 0
    const recipients = isBulkEmail ? userGroups : [userGroup]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const emailPayload = {
                ...emailData,
                recipients: isBulkEmail ? userGroups.filter((ug) => selectedRecipients.includes(ug.user?._id)) : [userGroup],
                type: isBulkEmail ? "bulk" : "single",
            }

            await onSend(emailPayload)
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleRecipient = (userId) => {
        setSelectedRecipients((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    }

    const selectAllRecipients = () => {
        setSelectedRecipients(userGroups.map((ug) => ug.user?._id))
    }

    const deselectAllRecipients = () => {
        setSelectedRecipients([])
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        {isBulkEmail ? "Gửi email nhắc nhở hàng loạt" : "Gửi email nhắc nhở"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Recipients */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                {isBulkEmail ? <Users className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                <span className="font-medium">{isBulkEmail ? `Người nhận (${recipients.length})` : "Người nhận"}</span>
                            </div>

                            {isBulkEmail ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={selectAllRecipients}>
                                            Chọn tất cả
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={deselectAllRecipients}>
                                            Bỏ chọn tất cả
                                        </Button>
                                    </div>

                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {userGroups.map((ug) => (
                                            <div key={ug.user?._id} className="flex items-center space-x-3 p-3 border rounded">
                                                <Checkbox
                                                    checked={selectedRecipients.includes(ug.user?._id)}
                                                    onCheckedChange={() => toggleRecipient(ug.user?._id)}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium">{ug.user?.fullName}</div>
                                                            <div className="text-sm text-muted-foreground">{ug.user?.email}</div>
                                                            <Badge
                                                                className={
                                                                    ug.user?.type === "VIP"
                                                                        ? "bg-purple-100 text-purple-800"
                                                                        : ug.user?.type === "loyal"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                }
                                                            >
                                                                {getUserTypeLabel(ug.user?.type)}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <div className="flex gap-2">
                                                                <Badge variant="outline" className="text-green-600">
                                                                    {ug.activeCoupons} hoạt động
                                                                </Badge>
                                                                <Badge variant="outline" className="text-yellow-600">
                                                                    {ug.expiringCoupons} sắp hết hạn
                                                                </Badge>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">Tổng: {ug.totalCoupons} coupons</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{userGroup?.user?.fullName}</div>
                                        <div className="text-sm text-muted-foreground">{userGroup?.user?.email}</div>
                                        <Badge
                                            className={
                                                userGroup?.user?.type === "VIP"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : userGroup?.user?.type === "loyal"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {getUserTypeLabel(userGroup?.user?.type)}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex gap-1 mb-1">
                                            <Badge variant="outline" className="text-xs">
                                                <Gift className="h-3 w-3 mr-1" />
                                                {userGroup?.totalCoupons}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{userGroup?.expiringCoupons} sắp hết hạn</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Email Content */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Tiêu đề email</Label>
                            <Input
                                id="subject"
                                value={emailData.subject}
                                onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                                placeholder="Nhập tiêu đề email..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Nội dung email</Label>
                            <Textarea
                                id="message"
                                value={emailData.message}
                                onChange={(e) => setEmailData((prev) => ({ ...prev, message: e.target.value }))}
                                placeholder="Nhập nội dung email..."
                                rows={8}
                                required
                            />
                        </div>
                    </div>

                    {/* Scheduling Options */}
                    {/* <Card>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="font-medium">Lịch gửi email</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={emailData.sendImmediately}
                                            onCheckedChange={(checked) => setEmailData((prev) => ({ ...prev, sendImmediately: checked }))}
                                        />
                                        <Label>Gửi ngay lập tức</Label>
                                    </div>

                                    {!emailData.sendImmediately && (
                                        <div className="grid gap-4 md:grid-cols-2 ml-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="scheduleDate">Ngày gửi</Label>
                                                <Input
                                                    id="scheduleDate"
                                                    type="date"
                                                    value={emailData.scheduleDate}
                                                    onChange={(e) => setEmailData((prev) => ({ ...prev, scheduleDate: e.target.value }))}
                                                    min={new Date().toISOString().split("T")[0]}
                                                    required={!emailData.sendImmediately}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="scheduleTime">Giờ gửi</Label>
                                                <Input
                                                    id="scheduleTime"
                                                    type="time"
                                                    value={emailData.scheduleTime}
                                                    onChange={(e) => setEmailData((prev) => ({ ...prev, scheduleTime: e.target.value }))}
                                                    required={!emailData.sendImmediately}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                (isBulkEmail && selectedRecipients.length === 0) ||
                                (!emailData.sendImmediately && (!emailData.scheduleDate || !emailData.scheduleTime))
                            }
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Đang gửi..." : emailData.sendImmediately ? "Gửi ngay" : "Lên lịch gửi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
