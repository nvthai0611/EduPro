import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const getStatusBadge = (status) => {
  const colors = {
    pending: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md",
    confirmed: "bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0 shadow-md",
    cancelled: "bg-gradient-to-r from-red-400 to-red-500 text-white border-0 shadow-md",
    completed: "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-md",
  }

  const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Không rõ"
  const statusColor = colors[status] || "bg-gray-400 text-white border-0"

  return <Badge className={statusColor}>{statusText}</Badge>
}

const formatCurrency = (amount) => {
  try {
    if (!amount || isNaN(amount)) return "0₫"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  } catch (error) {
    console.error("Lỗi định dạng tiền tệ:", error)
    return `₫${amount || 0}`
  }
}

const formatDate = (dateValue) => {
  try {
    if (!dateValue) return "N/A"
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return "Ngày không hợp lệ"
    return format(date, "dd MMM yyyy")
  } catch (error) {
    console.error("Lỗi định dạng ngày:", error)
    return "N/A"
  }
}

export default function OrdersTable({ bookings }) {
  if (!bookings || !Array.isArray(bookings)) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-gray-500">Không có dữ liệu đơn đặt</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-gray-500">Không tìm thấy đơn đặt phù hợp với bộ lọc</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày & Giờ</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Đã trả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Chi nhánh</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            try {
              const customer = booking?.customerId || {}
              const service = booking?.serviceId?.[0] || {}
              const staff = booking?.staffId?.[0] || {}
              const staffUser = staff?.userId || {}
              const branch = booking?.branchId || {}
              const room = booking?.roomId?.[0] || null
              const coupon = booking?.couponCode || null

              const customerName = customer.fullName || "Không rõ"
              const customerEmail = customer.email || "Chưa có email"
              const customerPhone = customer.phone || ""

              const serviceName = service.name || "Không rõ"
              const serviceBasePrice = service.basePrice || 0

              const staffName = staffUser.fullName || staff.name || "Không rõ"
              const staffPosition = staff.position || ""
              const staffRating = staff.rating || 0

              const branchName = branch.name || "Không rõ"
              const branchDistrict = branch.district || ""
              const roomName = room?.name || ""

              const createDate = booking?.createAt || new Date()
              const bookingDate = booking?.dateTime || new Date()
              const startTime = booking?.startTime || "N/A"
              const duration = booking?.duration || 0
              const totalPrice = booking?.totalPrice || 0
              const totalPay = booking?.totalPay || 0
              const status = booking?.status || "unknown"

              return (
                <TableRow key={booking?._id || Math.random()}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customerName}</div>
                      <div className="text-sm text-muted-foreground">{customerEmail}</div>
                      {customerPhone && (
                        <div className="text-xs text-muted-foreground">{customerPhone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{serviceName}</div>
                      <div className="text-sm text-muted-foreground">
                        Giá gốc: {formatCurrency(serviceBasePrice)}
                      </div>
                      {coupon && (
                        <div className="text-xs text-green-600">
                          Mã giảm: {coupon.code || "N/A"} (-{coupon.discount || 0}%)
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{staffName}</div>
                      <div className="text-sm text-muted-foreground">{staffPosition}</div>
                      {staffRating > 0 && (
                        <div className="text-xs text-yellow-600">★ {staffRating}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatDate(createDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatDate(bookingDate)}</div>
                      <div className="text-sm text-muted-foreground">{startTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>{duration} phút</TableCell>
                  <TableCell>{formatCurrency(totalPrice)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatCurrency(totalPay)}</div>
                      {totalPay < totalPrice && (
                        <div className="text-sm text-red-600">
                          Còn thiếu: {formatCurrency(totalPrice - totalPay)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{branchName}</div>
                      {branchDistrict && (
                        <div className="text-xs text-muted-foreground">{branchDistrict}</div>
                      )}
                      {roomName && <div className="text-xs text-blue-600">{roomName}</div>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            } catch (error) {
              console.error("Lỗi khi hiển thị hàng:", error, booking)
              return (
                <TableRow key={booking?._id || Math.random()}>
                  <TableCell colSpan={9} className="text-center text-red-500">
                    Lỗi hiển thị dữ liệu đặt lịch
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </div>
  )
}
