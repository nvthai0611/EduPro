import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function ChartsSection({ monthlyChartData, statusChartData, formatCurrency }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Cart nay chiem nhieu phan hon chiem 3/4 cua man hinh */}
      <Card className="col-span-3" >
        <CardHeader>
          <CardTitle>Thống kê theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}tr`; // Định dạng X.Ytr
                }
                // Bạn có thể thêm các điều kiện khác ở đây nếu muốn định dạng cho hàng nghìn (k) hoặc các giá trị nhỏ hơn.
                // Ví dụ:
                // if (value >= 1000) {
                //   return `${(value / 1000).toFixed(0)}k`;
                // }
                return value; // Giữ nguyên giá trị nếu không phải hàng triệu
              }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") {
                    // Nếu giá trị lớn hơn hoặc bằng 1,000,000
                    if (value >= 1000000) {
                      // Chia cho 1,000,000 và làm tròn đến 2 chữ số thập phân (nếu cần)
                      const formattedValue = (value / 1000000).toFixed(1); // hoặc .toFixed(0) nếu bạn muốn số nguyên
                      return [`${formattedValue}tr`, "Doanh thu"];
                    }
                    // Nếu không, sử dụng định dạng tiền tệ thông thường
                    return [formatCurrency(value), "Doanh thu"];
                  }
                  // Đối với các giá trị khác (ví dụ: orders)
                  return [value, "Đơn hàng"];
                }}
              />
              <Bar dataKey="orders" fill="#8884d8" name="orders" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Trạng thái đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
