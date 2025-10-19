import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../shadcn-ui/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function HourlyBookingsChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-purple-600">
            Số booking: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Theo Giờ</CardTitle>
        <CardDescription>
          Phân bố booking theo giờ trong ngày
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="hour"
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookings"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 