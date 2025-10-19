import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shadcn-ui/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, Users } from "lucide-react"

export default function RevenueCards({ 
  totalRevenue, 
  profit, 
  totalBookings, 
  completedBookings, 
  completionRate,
  comparisonData = null 
}) {
  // Hàm helper để xác định trend và màu sắc
  const getTrendInfo = (change) => {
    if (change > 0) {
      return {
        trend: "up",
        color: "text-green-600",
        bgColor: "bg-green-50",
        iconColor: "text-green-600"
      }
    } else if (change < 0) {
      return {
        trend: "down",
        color: "text-red-600",
        bgColor: "bg-red-50",
        iconColor: "text-red-600"
      }
    } else {
      return {
        trend: "neutral",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-600"
      }
    }
  }

  // Hàm helper để format phần trăm thay đổi
  const formatChange = (change) => {
    if (change > 0) {
      return `+${change}%`
    } else if (change < 0) {
      return `${change}%`
    } else {
      return "0%"
    }
  }

  const cards = [
    {
      title: "Tổng Doanh Thu",
      value: `${totalRevenue.toLocaleString()} VNĐ`,
      description: "Tổng doanh thu trong khoảng thời gian",
      icon: DollarSign,
      change: comparisonData?.totalRevenue?.change || 0,
      ...getTrendInfo(comparisonData?.totalRevenue?.change || 0)
    },
    {
      title: "Lợi Nhuận",
      value: `${profit.toLocaleString()} VNĐ`,
      description: "Lợi nhuận",
      icon: DollarSign,
      change: comparisonData?.profit?.change || 0,
      ...getTrendInfo(comparisonData?.profit?.change || 0)
    },
    {
      title: "Booking Hoàn Thành",
      value: completedBookings.toString(),
      description: "Số lượng booking đã hoàn thành",
      icon: CheckCircle,
      change: comparisonData?.completedBookings?.change || 0,
      ...getTrendInfo(comparisonData?.completedBookings?.change || 0)
    },
    {
      title: "Tỷ Lệ Hoàn Thành",
      value: `${completionRate.toFixed(1)}%`,
      description: "Tỷ lệ booking hoàn thành",
      icon: Users,
      change: comparisonData?.completionRate?.change || 0,
      ...getTrendInfo(comparisonData?.completionRate?.change || 0)
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              <div className="flex items-center mt-2">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : card.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                ) : null}
                <span className={`text-xs ${card.color}`}>
                  {formatChange(card.change)}
                </span>
                <span className="text-xs text-gray-500 ml-1">so với kì trước</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 