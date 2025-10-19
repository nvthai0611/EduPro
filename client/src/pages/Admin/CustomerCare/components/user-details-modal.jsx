"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Mail, Phone, User, CreditCard } from "lucide-react"

export default function UserDetailsModal({ user, bookings = [], isOpen, onClose }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xử lý"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết khách hàng</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="font-semibold">{user?.fullName || "N/A"}</div>
                  <Badge
                    className={
                      user?.type === "VIP"
                        ? "bg-purple-100 text-purple-800"
                        : user?.type === "loyal"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {getUserTypeLabel(user?.type)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user?.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user?.phoneNumber || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Sinh nhật: {user?.birthDate ? new Date(user.birthDate).toLocaleDateString("vi-VN") : "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thống kê booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user?.completedBookings || 0}</div>
                  <div className="text-sm text-green-700">Hoàn thành</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user?.totalBookings || 0}</div>
                  <div className="text-sm text-blue-700">Tổng booking</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{user?.pendingBookings || 0}</div>
                  <div className="text-sm text-yellow-700">Chờ xử lý</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{user?.cancelledBookings || 0}</div>
                  <div className="text-sm text-red-700">Đã hủy</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(user.totalSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử booking ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-right">Giá tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.slice(0, 10)?.map((booking) => (
                    <TableRow key={booking?._id}>
                      <TableCell>
                        {booking?.dateTime ? new Date(booking.dateTime).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>
                      <TableCell>{booking?.startTime || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking?.status)}>{getStatusLabel(booking?.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking?.type === "online" ? "Online" : "Offline"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(booking?.totalPay || 0)}
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </div>
            {bookings.length > 10 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Hiển thị 10/{bookings.length} booking gần nhất
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
