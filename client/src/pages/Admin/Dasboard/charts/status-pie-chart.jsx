"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatusPieChart({ data }) {
  const RADIAN = Math.PI / 180 // Hằng số để chuyển đổi độ sang radian
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5 // Bán kính trung bình
    const x = cx + radius * Math.cos(-midAngle * RADIAN) // Tọa độ X của nhãn
    const y = cy + radius * Math.sin(-midAngle * RADIAN) // Tọa độ Y của nhãn

    return (
      <text
        x={x}
        y={y}
        fill="white" // Màu chữ trắng
        textAnchor={x > cx ? "start" : "end"} // Vị trí neo văn bản dựa trên vị trí tương đối so với tâm
        dominantBaseline="central" // Căn chỉnh theo chiều dọc
        fontSize="12" // Kích thước chữ
        fontWeight="bold" // Chữ in đậm
      >
        {`${(percent * 100).toFixed(0)}%`} {/* Hiển thị phần trăm làm tròn không có số thập phân */}
      </text>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900">Phân bố trạng thái đặt chỗ</CardTitle>
        <CardDescription className="text-purple-700">Thống kê trạng thái hiện tại</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data} // Dữ liệu cho biểu đồ hình tròn
              cx="50%" // Vị trí trung tâm X
              cy="50%" // Vị trí trung tâm Y
              labelLine={false} // Không hiển thị đường nối từ lát cắt đến nhãn
              label={renderCustomizedLabel} // Sử dụng hàm tùy chỉnh để render nhãn
              outerRadius={100} // Bán kính ngoài của biểu đồ
              fill="#8884d8" // Màu mặc định cho các lát cắt (sẽ bị Cell ghi đè)
              dataKey="value" // Thuộc tính trong dữ liệu dùng để xác định kích thước lát cắt
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} /> // Gán màu cho từng lát cắt từ dữ liệu
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FDF2F8", // Nền Tooltip màu hồng nhạt
                border: "1px solid #F3E8FF", // Viền Tooltip màu tím nhạt
                borderRadius: "8px", // Bo tròn góc Tooltip
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Đổ bóng Tooltip
              }}
            />
            <Legend /> {/* Hiển thị chú giải */}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}