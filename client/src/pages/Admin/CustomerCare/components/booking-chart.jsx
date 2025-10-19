"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingChart({ data = {} }) {
  const chartData = useMemo(() => {
    if (!data?.bookings) return []

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i
      const monthBookings =
        data.bookings?.filter((booking) => {
          const bookingMonth = new Date(booking?.dateTime).getMonth()
          return bookingMonth === month
        }) || []

      const completed = monthBookings.filter((b) => b?.status === "completed").length
      const cancelled = monthBookings.filter((b) => b?.status === "cancelled").length
      const pending = monthBookings.filter((b) => b?.status === "pending").length
      const confirmed = monthBookings.filter((b) => b?.status === "confirmed").length

      return {
        month: new Date(2024, month).toLocaleDateString("vi-VN", { month: "short" }),
        completed,
        cancelled,
        pending,
        confirmed,
        total: monthBookings.length,
      }
    })

    return monthlyData
  }, [data])

  const maxValue = Math.max(...chartData.map((d) => d.total))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Monthly Booking Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Biểu đồ booking theo tháng</CardTitle>
          <CardDescription>Thống kê số lượng booking trong năm 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-muted-foreground">Tổng: {data.total}</span>
                </div>
                <div className="flex h-6 rounded-full overflow-hidden bg-gray-100">
                  {data.completed > 0 && (
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(data.completed / maxValue) * 100}%` }}
                      title={`Hoàn thành: ${data.completed}`}
                    >
                      {data.completed > 0 && data.completed}
                    </div>
                  )}
                  {data.confirmed > 0 && (
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(data.confirmed / maxValue) * 100}%` }}
                      title={`Đã xác nhận: ${data.confirmed}`}
                    >
                      {data.confirmed > 0 && data.confirmed}
                    </div>
                  )}
                  {data.pending > 0 && (
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(data.pending / maxValue) * 100}%` }}
                      title={`Chờ xử lý: ${data.pending}`}
                    >
                      {data.pending > 0 && data.pending}
                    </div>
                  )}
                  {data.cancelled > 0 && (
                    <div
                      className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(data.cancelled / maxValue) * 100}%` }}
                      title={`Đã hủy: ${data.cancelled}`}
                    >
                      {data.cancelled > 0 && data.cancelled}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Hoàn thành</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Đã xác nhận</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Chờ xử lý</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Đã hủy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố loại khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["normal", "loyal", "VIP"].map((type) => {
              const count = data?.users?.filter((u) => u?.type === type).length || 0
              const percentage = data?.users?.length ? ((count / data.users.length) * 100).toFixed(1) : "0"
              const label = type === "normal" ? "Thường" : type === "loyal" ? "Thân thiết" : "VIP"
              const color = type === "VIP" ? "bg-purple-500" : type === "loyal" ? "bg-blue-500" : "bg-gray-500"

              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booking Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố trạng thái booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["completed", "confirmed", "pending", "cancelled"].map((status) => {
              const count = data?.bookings?.filter((b) => b?.status === status).length || 0
              const percentage = data?.bookings?.length ? ((count / data.bookings.length) * 100).toFixed(1) : "0"
              const label =
                status === "completed"
                  ? "Hoàn thành"
                  : status === "confirmed"
                    ? "Đã xác nhận"
                    : status === "pending"
                      ? "Chờ xử lý"
                      : "Đã hủy"
              const color =
                status === "completed"
                  ? "bg-green-500"
                  : status === "confirmed"
                    ? "bg-blue-500"
                    : status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"

              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
