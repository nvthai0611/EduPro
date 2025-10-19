import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../shadcn-ui/components/ui/dialog"
import { Badge } from "../../../../shadcn-ui/components/ui/badge"
import { Button } from "../../../../shadcn-ui/components/ui/button"
import { Separator } from "../../../../shadcn-ui/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function BookingDetailDialog({ booking, isOpen, onClose }) {
  if (!booking) return null

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        label: "Chờ xử lý", 
        color: "bg-yellow-100 text-yellow-800",
        icon: ClockIcon
      },
      confirmed: { 
        label: "Đã xác nhận", 
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle
      },
      no_show: { 
        label: "Không đến", 
        color: "bg-gray-100 text-gray-800",
        icon: XCircle
      },
      completed: { 
        label: "Hoàn thành", 
        color: "bg-green-100 text-green-800",
        icon: CheckCircle
      },
      cancelled: { 
        label: "Đã hủy", 
        color: "bg-red-100 text-red-800",
        icon: XCircle
      }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
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
    return format(date, "EEEE, dd/MM/yyyy", { locale: vi })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      cash: "Tiền mặt",
      card: "Thẻ tín dụng",
      transfer: "Chuyển khoản",
      online: "Thanh toán online"
    }
    return methods[method] || method
  }

  const getBookingTypeText = (type) => {
    const types = {
      online: "Đặt online",
      offline: "Đặt tại quầy"
    }
    return types[type] || type
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              Chi tiết Booking
              <div className="flex items-center justify-end">
                {getStatusBadge(booking.status)}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về booking này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{booking.customerId?.fullName || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{booking.customerId?.phoneNumber || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{booking.customerId?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Thông tin đặt lịch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ngày:</span>
                  <span>{formatDateTime(booking.dateTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Giờ:</span>
                  <span>{formatTime(booking.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Loại đặt:</span>
                  <span>{getBookingTypeText(booking.type)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{booking.branchId?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>
                    {booking.staffId
                      .map((staff) => staff.userId.fullName)
                      .join(", ") || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ghi chú:</span>
                  <span>{booking.note || "Không có"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Dịch vụ đã chọn</h3>
            <div className="space-y-3">
              {booking.serviceId?.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <img
                      src={
                        service?.images[0] ||
                        "https://beautyzoneacademy.com/wp-content/uploads/2020/11/pic10.jpg"
                      }
                      alt={service.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">
                      {service.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(service.basePrice)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Thời gian: {service.duration || "N/A"} phút
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Đã thanh toán:</span>
                  <span>{booking.isPaid ? "Có" : "Chưa"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="text-gray-600">
                    {formatCurrency(booking.totalPrice || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Giảm giá:</span>
                  <span className="text-red-600">
                    -{formatCurrency(booking.totalDiscount || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Thành tiền:</span>
                  <span className="text-green-600">
                    {formatCurrency(booking.totalPay || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 