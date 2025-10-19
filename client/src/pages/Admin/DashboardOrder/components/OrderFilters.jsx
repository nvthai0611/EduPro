"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function OrderFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Thanh toán khi nhận hàng  </SelectItem>
          <SelectItem value="paid">Đã thanh toán</SelectItem>
          <SelectItem value="completed">Hoàn thành</SelectItem>
          <SelectItem value="cancelled">Đã hủy</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Thời gian" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="today">Hôm nay</SelectItem>
          <SelectItem value="week">7 ngày qua</SelectItem>
          <SelectItem value="month">30 ngày qua</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
