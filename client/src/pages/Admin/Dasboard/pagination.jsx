"use client"

import { Button } from "@/components/ui/button"

export default function Pagination({ currentPage, totalPages, onPageChange, startIndex, itemsPerPage, totalItems }) {
  // Safe number handling
  const safeCurrentPage = Number(currentPage) || 1
  const safeTotalPages = Number(totalPages) || 0
  const safeStartIndex = Number(startIndex) || 0
  const safeItemsPerPage = Number(itemsPerPage) || 10
  const safeTotalItems = Number(totalItems) || 0

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (safeTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i)
      }
    } else if (safeCurrentPage <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i)
      }
    } else if (safeCurrentPage >= safeTotalPages - 2) {
      for (let i = safeTotalPages - maxVisiblePages + 1; i <= safeTotalPages; i++) {
        pages.push(i)
      }
    } else {
      for (let i = safeCurrentPage - 2; i <= safeCurrentPage + 2; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  // Handle edge cases
  if (safeTotalPages === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Không có dữ liệu trong trang này</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Hiển thị {safeStartIndex + 1} từ {Math.min(safeStartIndex + safeItemsPerPage, safeTotalItems)} trong{" "}
        {safeTotalItems} kết quả
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(Math.max(safeCurrentPage - 1, 1))}
          disabled={safeCurrentPage === 1}
        >
          Trước
        </Button>

        <div className="flex items-center space-x-1">
          {generatePageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={safeCurrentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange && onPageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(Math.min(safeCurrentPage + 1, safeTotalPages))}
          disabled={safeCurrentPage === safeTotalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  )
}
