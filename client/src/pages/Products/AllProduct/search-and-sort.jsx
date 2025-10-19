"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchAndSort({ searchTerm, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm theo tên...."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="name">Tên (A-Z)</SelectItem>
          <SelectItem value="price-low">Giá (Thấp đến cao)</SelectItem>
          <SelectItem value="price-high">Giá (Cao đến thấp)</SelectItem>
          <SelectItem value="rating">Đánh giá</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
