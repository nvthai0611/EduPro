"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPriceChartTrend } from "../../../../utils/format"

export default function RevenueChart({ data }) {
  const sortedData = data.sort((a, b) => {
    // Chuyển đổi chuỗi tháng thành đối tượng Date để so sánh
    // Giả sử định dạng tháng là "YYYY-MM" hoặc có thể tạo được Date hợp lệ
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB; // Sắp xếp từ cũ đến mới (tăng dần)
  });
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Xu hướng doanh thu</CardTitle>
        <CardDescription className="text-blue-700">Xu hướng doanh thu và đặt chỗ hàng tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
            <XAxis dataKey="month" stroke="#6366F1" />
            <YAxis stroke="#6366F1" tickFormatter={formatPriceChartTrend} />
            <Tooltip
              formatter={(value) => formatPriceChartTrend(value)}
              contentStyle={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#revenueGradient)"
              name="Doanh thu ($)"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#targetGradient)"
              name="Mục tiêu ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}