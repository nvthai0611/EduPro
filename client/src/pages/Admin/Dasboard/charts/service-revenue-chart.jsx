"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Award, Star } from "lucide-react" // Các icon từ thư viện lucide-react
import { formatPriceChart } from "../../../../utils/format" // Hàm tiện ích để định dạng giá

export default function ServiceRevenueChart({ data }) {
  // Mảng màu gradient đẹp mắt cho mỗi cột
  const colors = [
    "#8B5CF6", // Tím
    "#06B6D4", // Xanh lam ngọc
    "#10B981", // Xanh lục bảo
    "#F59E0B", // Hổ phách
    "#EF4444", // Đỏ
    "#3B82F6", // Xanh dương
    "#EC4899", // Hồng
    "#84CC16", // Xanh nõn chuối
  ]

  // Thành phần Tooltip tùy chỉnh
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-lg font-bold text-green-600">{payload[0].value.toLocaleString()}đ</p>
          <p className="text-sm text-gray-500">Doanh thu tạo ra</p>
        </div>
      )
    }
    return null
  }

  // Thành phần Bar tùy chỉnh để áp dụng gradient và bo góc
  const CustomBar = (props) => {
    const { fill, ...rest } = props
    return <Bar {...rest} fill={`url(#gradient-${String(rest.payload?.name ?? "").replace(/\s+/g, "")})`} radius={[8, 8, 0, 0]} />
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> {/* Icon giải thưởng */}
              Dịch vụ hàng đầu theo doanh thu
            </CardTitle>
            <CardDescription className="text-indigo-700 mt-1">Các dịch vụ hoạt động tốt nhất trong tháng này</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" /> {/* Icon xu hướng tăng */}
            <span className="text-sm font-medium text-green-700">Đang tăng trưởng</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              {data.map((item, index) => (
                <linearGradient
                  key={item.name}
                  id={`gradient-${String(item.name ?? "").replace(/\s+/g, "")}`} // ID gradient duy nhất
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {/* Điểm dừng màu gradient */}
                  <stop offset="0%" stopColor={colors[index % colors.length]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={colors[index % colors.length]} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.5} /> {/* Lưới biểu đồ */}
            <XAxis
              dataKey="name" // Dữ liệu cho trục X là tên dịch vụ
              stroke="#6366F1" // Màu nét vẽ
              fontSize={12} // Kích thước chữ
              angle={-45} // Xoay nhãn
              textAnchor="end" // Vị trí neo văn bản
              height={80} // Chiều cao trục
              interval={0} // Hiển thị tất cả nhãn
            />
            <YAxis stroke="#6366F1" fontSize={12} tickFormatter={(value) => `${formatPriceChart(value)}đ`} /> {/* Trục Y */}
            <Tooltip content={<CustomTooltip />} /> {/* Sử dụng Tooltip tùy chỉnh */}
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}> {/* Cột biểu đồ với bo góc */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} /> // Áp dụng màu cho từng cột
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Thống kê dịch vụ */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" /> {/* Icon ngôi sao */}
              <span className="text-sm font-medium text-gray-700">Dịch vụ hàng đầu</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">{data[0]?.name}</p> {/* Tên dịch vụ hàng đầu */}
            <p className="text-sm text-gray-600">{data[0]?.revenue.toLocaleString()}đ</p> {/* Doanh thu dịch vụ hàng đầu */}
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" /> {/* Icon xu hướng tăng */}
              <span className="text-sm font-medium text-gray-700">Tổng doanh thu</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}đ {/* Tổng doanh thu */}
            </p>
            <p className="text-sm text-gray-600">Từ các dịch vụ hàng đầu</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}