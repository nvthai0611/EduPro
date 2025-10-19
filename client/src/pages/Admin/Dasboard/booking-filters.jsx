"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Database } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

export default function BộLọcĐặtLịch({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  resetToDefaultDates,
  setQuickDateRange,
  isActiveDateRange,
  branch = { branch },
  setBranch = { setBranch },
  branchFilter = { branchFilter },
  setBranchFilter = { setBranchFilter }
}) {
  // Định dạng ngày an toàn
  const formatDateSafe = (date) => {
    try {
      if (!date) return "Không có ngày"
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error)
      return "Ngày không hợp lệ"
    }
  }

  // Thông tin gỡ lỗi
  const debugInfo = () => {
    console.log("Bộ lọc hiện tại:", {
      searchTerm,
      statusFilter,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    })
  }

  return (
    <div className="space-y-4">
      {/* Thông tin gỡ lỗi */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <Database className="h-3 w-3" />
        <span>
          Khoảng thời gian: {formatDateSafe(dateFrom)} - {formatDateSafe(dateTo)}
        </span>
      </div>

      {/* Bộ lọc nhanh theo ngày */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 flex items-center">Bộ lọc nhanh:</span>
        <div>
          <Button variant="outline" size="sm" onClick={() => setQuickDateRange(7)} className={isActiveDateRange == 7 ? "text-xs bg-blue-100 border-blue-300 text-blue-800" : "text-xs"}>
            7 ngày gần nhất
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange(30)}
            className={isActiveDateRange == 30 ? "text-xs bg-blue-100 border-blue-300 text-blue-800" : "text-xs"}
          >
            30 ngày gần nhất (Mặc định)
          </Button>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => setQuickDateRange(90)} className={isActiveDateRange == 90 ? "text-xs bg-blue-100 border-blue-300 text-blue-800" : "text-xs"}>
            3 tháng gần nhất
          </Button>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={resetToDefaultDates} className="text-xs">
            Đặt lại
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFrom(null)
              setDateTo(null)
            }}
            className="text-xs"
          >
            Hiển thị tất cả
          </Button>
        </div>

        <div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px] text-xs bg-white">
              <SelectValue placeholder="Chọn chi nhánh" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                {branch.map((bran) => (
                  <SelectItem value={bran._id}>{bran.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bộ lọc chính */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email khách hàng..."
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="completed">Đã hoàn tất</SelectItem>
            <SelectItem value="cancelled">Đã huỷ</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? formatDateSafe(dateFrom).split(",")[0] : "Từ ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? formatDateSafe(dateTo).split(",")[0] : "Đến ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Hiển thị bộ lọc ngày đang áp dụng */}
      {(dateFrom || dateTo) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
          <span className="font-medium">Bộ lọc ngày đang dùng:</span>
          <span>
            {formatDateSafe(dateFrom)} - {formatDateSafe(dateTo)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateFrom(null)
              setDateTo(null)
            }}
            className="ml-auto text-xs text-gray-500 hover:text-gray-700"
          >
            Xoá ngày lọc
          </Button>
        </div>
      )}
    </div>
  )
}
