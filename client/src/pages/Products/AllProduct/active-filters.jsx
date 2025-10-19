"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "../../../utils/format"

export default function ActiveFilters({
  hasActiveFilters,
  searchTerm,
  selectedCategory,
  priceRange,
  minPrice,
  maxPrice,
  categories,
  onClearSearch,
  onClearCategory,
  onClearPrice,
  onClearAll,
  getActiveFiltersCount,
  maxPriceProduct
}) {

  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat?._id === categoryId)
    return category ? category?.name : "Unknown"
  }

  // Hàm trợ giúp để đảm bảo giá trị luôn là số hoặc 0
  const getNumericPrice = (priceValue) => {
    // Chuyển đổi sang số, nếu NaN (Not a Number) thì mặc định là 0
    return Number(priceValue) || 0;
  };

  if (!hasActiveFilters) return null

  return (
    <div className="flex items-center justify-between gap-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-blue-800">Bộ lọc hiện tại:</span>

        {searchTerm && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Tìm kiếm: "{searchTerm}"
            <button onClick={onClearSearch} className="ml-1 hover:text-blue-900">
              ×
            </button>
          </Badge>
        )}

        {selectedCategory !== "all" && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Loại: {getCategoryName(selectedCategory)}
            <button onClick={onClearCategory} className="ml-1 hover:text-blue-900 w-fit">
              ×
            </button>
          </Badge>
        )}

        {(priceRange[0] !== 0 || priceRange[1] !== maxPriceProduct || minPrice !== "" || maxPrice !== "") && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 ">
            {/* Giá: {formatPrice(** getNumericPrice(minPrice || priceRange[0]) **)} - {formatPrice(** getNumericPrice(maxPrice || priceRange[1]) **)} */}
            {/* Sửa dòng trên thành: */}
            Giá: {formatPrice(getNumericPrice(minPrice || priceRange[0]))} - {formatPrice(getNumericPrice(maxPrice || priceRange[1]))}
            <button onClick={onClearPrice} className="ml-1 hover:text-blue-900 w-fit">
              ×
            </button>
          </Badge>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 hover:text-blue-800 w-fit"
      >
        Xóa tất cả bộ lọc ({getActiveFiltersCount()})
      </Button>
    </div>
  )
}