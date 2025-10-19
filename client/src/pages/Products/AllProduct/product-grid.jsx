"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "./product-card"
import Pagination from "./pagination"
import { useEffect, useRef } from "react"

export default function ProductGrid({
  products,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  hasActiveFilters,
  getCategoryName,
  onViewReviews,
  onPageChange,
  onItemsPerPageChange,
  onClearFilters,
}) {

  return (
    <div className="flex-1">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <p className="text-gray-600 w-fit">
            Hiển Thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length}{" "}
            sản phẩm
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                getCategoryName={getCategoryName}
                onViewReviews={onViewReviews}
              />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="mt-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
          >
            Xóa tất cả bộ lọc
          </Button>
        </div>
      )}
    </div>
  )
}
