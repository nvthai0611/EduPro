"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { formatPrice, parsePrice, formatPriceForInput } from "../../../utils/format"

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  minPrice, // minPrice và maxPrice ở đây phải là SỐ
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClearPriceFilter,
  categories,
  products,
  maxPriceProduct
}) {
  return (
    <div className="lg:w-64 flex-shrink-0">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Bộ lọc
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Lọc theo giá</h4>

            {/* Manual Price Input */}
            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Giá nhỏ nhất</label>
                  <Input
                    type="text" // Vẫn là type="text"
                    placeholder="0"
                    // Dùng formatPriceForInput để không có "VND"
                    value={minPrice !== null && minPrice !== undefined ? formatPriceForInput(minPrice) : ""}
                    onChange={(e) => {
                      const parsedValue = parsePrice(e.target.value);
                      onMinPriceChange(isNaN(parsedValue) ? null : parsedValue);
                    }}
                    className="text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Giá lớn nhất</label>
                  <Input
                    type="text" // Vẫn là type="text"
                    placeholder={formatPrice(maxPriceProduct)} // Placeholder vẫn dùng formatPrice (có VND)
                    // Dùng formatPriceForInput để không có "VND"
                    value={maxPrice !== null && maxPrice !== undefined ? formatPriceForInput(maxPrice) : ""}
                    onChange={(e) => {
                      const parsedValue = parsePrice(e.target.value);
                      onMaxPriceChange(isNaN(parsedValue) ? null : parsedValue);
                    }}
                    className="text-sm"
                  />
                </div>

              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearPriceFilter}
                className="w-full text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
              >
                Xóa bộ lọc
              </Button>
            </div>

            <div className="text-xs text-gray-500 mb-2">Hoặc sử dụng thanh trượt:</div>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={maxPriceProduct}
                min={0}
                step={10}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Loại</h4>
            <div className="space-y-2">
              {categories?.map((category) => {
                const count = products?.filter((p) => p?.category?._id === category?._id && p?.status)?.length
                return (
                  <div key={category?._id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{category?.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}