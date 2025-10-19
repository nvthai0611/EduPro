import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../shadcn-ui/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area } from "recharts"

export default function RevenueChart({ data }) {
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
          <p className="text-green-600">
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu Đồ Doanh Thu</CardTitle>
        <CardDescription>Doanh thu theo thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={10}
              tickLine={true}
              axisLine={true}
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
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 2 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 