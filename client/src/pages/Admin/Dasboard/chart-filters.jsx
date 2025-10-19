"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, BarChart3, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BoLocBieuDo({
    chartDateFrom,
    setChartDateFrom,
    chartDateTo,
    setChartDateTo,
    setChartQuickDateRange,
    totalBookings,
    checkDate,
    branch,
    setBranch,
    branchFilter,
    setBranchFilter
}) {
    return (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-purple-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                            Bộ lọc ngày cho biểu đồ và thống kê
                        </CardTitle>
                        <CardDescription className="text-purple-700">
                            Lọc dữ liệu cho biểu đồ và thẻ doanh thu (tách biệt với bộ lọc bảng)
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">{totalBookings} lượt đặt</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Bộ lọc nhanh */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center">Khoảng thời gian:</span>
                        <div>
                            <Button variant="outline" size="sm" onClick={() => setChartQuickDateRange(7)} className={checkDate == '7' ? "text-xs bg-purple-50 border-purple-200 text-purple-700" : "text-xs"}>
                                7 ngày gần nhất
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChartQuickDateRange(30)}
                                className={checkDate == 30 ? "text-xs bg-purple-50 border-purple-200 text-purple-700" : "text-xs"}
                            >
                                30 ngày gần nhất
                            </Button>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={() => setChartQuickDateRange(90)} className={checkDate == '90' ? "text-xs bg-purple-50 border-purple-200 text-purple-700" : "text-xs"}>
                                3 tháng gần nhất
                            </Button>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={() => setChartQuickDateRange(180)} className={checkDate == '180' ? "text-xs bg-purple-50 border-purple-200 text-purple-700" : "text-xs"}>
                                6 tháng gần nhất
                            </Button>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={() => setChartQuickDateRange(365)} className={checkDate == '365' ? "text-xs bg-purple-50 border-purple-200 text-purple-700" : "text-xs"}>
                                1 năm gần nhất
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
                                            <SelectItem key={bran._id} value={bran._id}>{bran.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Bộ chọn ngày tùy chỉnh */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Chọn khoảng ngày:</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {chartDateFrom ? format(chartDateFrom, "MMM dd") : "Từ ngày"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={chartDateFrom} onSelect={setChartDateFrom} initialFocus />
                                </PopoverContent>
                            </Popover>

                            <span className="text-gray-500">đến</span>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {chartDateTo ? format(chartDateTo, "MMM dd") : "Đến ngày"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={chartDateTo} onSelect={setChartDateTo} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setChartDateFrom(null)
                                    setChartDateTo(null)
                                    setBranchFilter("all")
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Xoá bộ lọc biểu đồ
                            </Button>
                        </div>
                    </div>

                    {/* Hiển thị bộ lọc đang áp dụng */}
                    {(chartDateFrom || chartDateTo) && (
                        <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-100 p-2 rounded-lg">
                            <span className="font-medium">Biểu đồ đang hiển thị từ:</span>
                            <span>
                                {chartDateFrom ? format(chartDateFrom, "MMM dd, yyyy") : "Bắt đầu"} -{" "}
                                {chartDateTo ? format(chartDateTo, "MMM dd, yyyy") : "Kết thúc"}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
