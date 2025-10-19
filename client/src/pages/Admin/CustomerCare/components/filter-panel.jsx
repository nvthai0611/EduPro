"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function FilterPanel({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tên, email, SĐT..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>

          {/* User Type Filter */}
          <Select value={filters.userType} onValueChange={(value) => updateFilter("userType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Loại khách hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại KH</SelectItem>
              <SelectItem value="normal">Thường</SelectItem>
              <SelectItem value="loyal">Thân thiết</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>

          {/* Booking Status Filter */}
          <Select value={filters.bookingStatus} onValueChange={(value) => updateFilter("bookingStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Có booking hoàn thành</SelectItem>
              <SelectItem value="inactive">Chưa hoàn thành booking</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completedBookings">Booking hoàn thành</SelectItem>
              <SelectItem value="totalBookings">Tổng booking</SelectItem>
              <SelectItem value="totalSpent">Tổng chi tiêu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
