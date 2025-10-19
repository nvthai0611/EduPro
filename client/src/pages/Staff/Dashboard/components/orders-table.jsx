import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shadcn-ui/components/ui/card"
import { Badge } from "../../../../shadcn-ui/components/ui/badge"
import { Button } from "../../../../shadcn-ui/components/ui/button"
import { Eye, Calendar, Clock, User, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import BookingDetailDialog from "./booking-detail-dialog"

export default function OrdersTable({ bookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedBooking(null)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Đã xác nhận", variant: "default", color: "bg-blue-100 text-blue-800" },
      no_show: { label: "Không đến", variant: "default", color: "bg-gray-100 text-gray-800" },
      completed: { label: "Hoàn thành", variant: "default", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", variant: "destructive", color: "bg-red-100 text-red-800" }
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy", { locale: vi })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh Sách Booking
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả booking của chi nhánh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">STT</th>
                  <th className="text-left p-2 font-medium">Khách hàng</th>
                  <th className="text-left p-2 font-medium">Dịch vụ</th>
                  <th className="text-left p-2 font-medium">Ngày</th>
                  <th className="text-left p-2 font-medium">Giờ</th>
                  <th className="text-left p-2 font-medium">Giá</th>
                  <th className="text-left p-2 font-medium">Trạng thái</th>
                  <th className="text-left p-2 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-sm">{index + 1}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{booking.customerId?.fullName || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{booking.customerId?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="font-medium truncate max-w-[150px]" title={booking.serviceId.map(service => service.name).join(', ')}>{booking.serviceId.map(service => service.name).join(', ') || 'N/A'}</div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{formatDate(booking.dateTime)}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{formatTime(booking.startTime)}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-green-600">
                          {formatCurrency(booking?.totalPay || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="h-3 w-3" />
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có booking nào trong khoảng thời gian này
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <BookingDetailDialog
        booking={selectedBooking}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  )
} 