import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shadcn-ui/components/ui/card"
import { Button } from "../../../../shadcn-ui/components/ui/button"
import { BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shadcn-ui/components/ui/select"

export default function ChartFilters({
  chartDateFrom,
  setChartDateFrom,
  chartDateTo,
  setChartDateTo,
  totalBookings,
  branch,
  setBranch,
  branchFilter,
  setBranchFilter,
  onFilterChange,
  filters
}) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" }
  ]

  const quarters = [
    { value: 1, label: "Quý 1" },
    { value: 2, label: "Quý 2" },
    { value: 3, label: "Quý 3" },
    { value: 4, label: "Quý 4" }
  ]

  // Lấy giá trị hiện tại từ filters
  const getCurrentViewType = () => filters?.viewType || 'month'
  const getCurrentYear = () => filters?.year || new Date().getFullYear()
  const getCurrentMonth = () => filters?.month || new Date().getMonth() + 1
  const getCurrentQuarter = () => filters?.quarter || Math.ceil((new Date().getMonth() + 1) / 3)

  const handleViewTypeChange = (viewType) => {
    const year = getCurrentYear()
    
    if (viewType === "month") {
      const month = getCurrentMonth()
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      setChartDateFrom(startDate)
      setChartDateTo(endDate)
      onFilterChange({ viewType, year, month })
    } else {
      const quarter = getCurrentQuarter()
      const startMonth = (quarter - 1) * 3
      const endMonth = startMonth + 2
      const startDate = new Date(year, startMonth, 1)
      const endDate = new Date(year, endMonth + 1, 0)
      setChartDateFrom(startDate)
      setChartDateTo(endDate)
      onFilterChange({ viewType, year, quarter })
    }
  }

  const handleYearChange = (year) => {
    const viewType = getCurrentViewType()
    
    if (viewType === "month") {
      const month = getCurrentMonth()
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      setChartDateFrom(startDate)
      setChartDateTo(endDate)
      onFilterChange({ year, month })
    } else {
      const quarter = getCurrentQuarter()
      const startMonth = (quarter - 1) * 3
      const endMonth = startMonth + 2
      const startDate = new Date(year, startMonth, 1)
      const endDate = new Date(year, endMonth + 1, 0)
      setChartDateFrom(startDate)
      setChartDateTo(endDate)
      onFilterChange({ year, quarter })
    }
  }

  const handleMonthChange = (month) => {
    const year = getCurrentYear()
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    setChartDateFrom(startDate)
    setChartDateTo(endDate)
    onFilterChange({ month })
  }

  const handleQuarterChange = (quarter) => {
    const year = getCurrentYear()
    const startMonth = (quarter - 1) * 3
    const endMonth = startMonth + 2
    const startDate = new Date(year, startMonth, 1)
    const endDate = new Date(year, endMonth + 1, 0)
    setChartDateFrom(startDate)
    setChartDateTo(endDate)
    onFilterChange({ quarter })
  }

  const currentViewType = getCurrentViewType()
  const currentYearValue = getCurrentYear()
  const currentMonthValue = getCurrentMonth()
  const currentQuarterValue = getCurrentQuarter()

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Bộ Lọc Biểu Đồ
        </CardTitle>
        <CardDescription>
          Tùy chỉnh khoảng thời gian hiển thị cho các biểu đồ thống kê
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* View Type */}
          <div className="flex gap-2">
            <Button
              variant={currentViewType === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewTypeChange("month")}
            >
              Theo tháng
            </Button>
            <Button
              variant={currentViewType === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewTypeChange("quarter")}
            >
              Theo quý
            </Button>
          </div>

          {/* Year Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Năm:</span>
            <Select value={currentYearValue.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month/Quarter Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentViewType === "month" ? "Tháng:" : "Quý:"}
            </span>
            <Select 
              value={currentViewType === "month" ? currentMonthValue.toString() : currentQuarterValue.toString()} 
              onValueChange={(value) => {
                if (currentViewType === "month") {
                  handleMonthChange(parseInt(value))
                } else {
                  handleQuarterChange(parseInt(value))
                }
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(currentViewType === "month" ? months : quarters).map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Tổng số booking:</strong> {totalBookings} booking trong
            {currentViewType === "month" 
              ? ` tháng ${currentMonthValue}/${currentYearValue}`
              : ` quý ${currentQuarterValue}/${currentYearValue}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 