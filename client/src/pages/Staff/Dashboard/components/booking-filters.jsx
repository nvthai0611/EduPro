import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shadcn-ui/components/ui/card"
import { Input } from "../../../../shadcn-ui/components/ui/input"
import { Button } from "../../../../shadcn-ui/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shadcn-ui/components/ui/select"
import { CalendarIcon, Search, Filter, RefreshCw } from "lucide-react"
import { Calendar } from "../../../../shadcn-ui/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../shadcn-ui/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "../../../../lib/utils"

export default function BookingFilters({
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
  branch,
  setBranch,
  branchFilter,
  setBranchFilter
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "no_show", label: "Không đến" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" }
  ]

  const quickDateRanges = [
    { days: 7, label: "7 ngày qua" },
    { days: 30, label: "30 ngày qua" },
    { days: 90, label: "90 ngày qua" },
    { days: 365, label: "1 năm qua" }
  ]

  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    resetToDefaultDates()
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ Lọc Booking
        </CardTitle>
        <CardDescription>
          Lọc và tìm kiếm booking theo các tiêu chí khác nhau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Đặt lại
          </Button>
        </div>

        {/* Date Range Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Khoảng thời gian:</span>
          </div>

          {/* Quick Date Range Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickDateRanges.map((range) => (
              <Button
                key={range.days}
                variant={isActiveDateRange === range.days ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickDateRange(range.days)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày:</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 