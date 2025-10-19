import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react"

// Hàm định dạng tiền tệ theo chuẩn Việt Nam
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function RevenueCards({
  totalRevenue,        // Tổng doanh thu
  pendingRevenue,      // Doanh thu đang chờ thanh toán
  totalBookings,       // Tổng lượt đặt
  completedBookings,   // Số lượt đã hoàn tất
  completionRate,      // Tỷ lệ hoàn tất (%)
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tổng doanh thu */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Tổng Doanh Thu</CardTitle>
          <div className="p-2 bg-white/20 rounded-full">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-blue-100">+12% so với tháng trước</p>
        </CardContent>
      </Card>

      {/* Doanh thu chờ xử lý */}
      {/* <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-100">Chờ Thanh Toán</CardTitle>
          <div className="p-2 bg-white/20 rounded-full">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
          <p className="text-xs text-amber-100">Đang chờ khách thanh toán</p>
        </CardContent>
      </Card> */}

      {/* Tổng lượt đặt */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Tổng Lượt Đặt</CardTitle>
          <div className="p-2 bg-white/20 rounded-full">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-purple-100">+8% so với tháng trước</p>
        </CardContent>
      </Card>

      {/* Số lượt hoàn tất */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">Hoàn tất</CardTitle>
          <div className="p-2 bg-white/20 rounded-full">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedBookings}</div>
          <p className="text-xs text-green-100">Tỷ lệ hoàn tất {completionRate}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
