"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ChartFilters({ yearFilter, setYearFilter, monthFilter, setMonthFilter }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Biểu đồ thống kê</h2>
      <div className="flex gap-4">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả năm</SelectItem>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tháng</SelectItem>
            <SelectItem value="1">Tháng 1</SelectItem>
            <SelectItem value="2">Tháng 2</SelectItem>
            <SelectItem value="3">Tháng 3</SelectItem>
            <SelectItem value="4">Tháng 4</SelectItem>
            <SelectItem value="5">Tháng 5</SelectItem>
            <SelectItem value="6">Tháng 6</SelectItem>
            <SelectItem value="7">Tháng 7</SelectItem>
            <SelectItem value="8">Tháng 8</SelectItem>
            <SelectItem value="9">Tháng 9</SelectItem>
            <SelectItem value="10">Tháng 10</SelectItem>
            <SelectItem value="11">Tháng 11</SelectItem>
            <SelectItem value="12">Tháng 12</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
