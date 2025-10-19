import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../shadcn-ui/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function ServiceRevenueChart({ data }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-600">
            Số booking: {payload[0].payload.bookings || 0}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh Thu Theo Dịch Vụ</CardTitle>
        <CardDescription>So sánh doanh thu giữa các dịch vụ</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              stroke="#888888"
              fontSize={10}
              tickLine={true}
              axisLine={true}
              dataKey="service"
              tickFormatter={(value) => value.split(' ').map((word, index) => word.charAt(0).toUpperCase()).join('')}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={true}
              axisLine={true}
              tickSize={0}
              tickMargin={0}
              tickCount={5}
              tickPadding={0}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 