"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HourlyBookingsChart({ data }) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">Khung Giờ Cao Điểm</CardTitle>
        <CardDescription className="text-orange-700">Số lượt đặt theo từng giờ trong ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            {/* Định nghĩa gradient màu cho biểu đồ */}
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FB923C" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            {/* Đường lưới biểu đồ */}
            <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />

            {/* Trục X hiển thị giờ */}
            <XAxis dataKey="hour" stroke="#EA580C" />

            {/* Trục Y hiển thị số lượt đặt */}
            <YAxis stroke="#EA580C" />

            {/* Tooltip hiển thị khi hover */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF7ED",
                border: "1px solid #FED7AA",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* Vùng biểu đồ chính */}
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#F97316"
              fillOpacity={1}
              fill="url(#hourlyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
