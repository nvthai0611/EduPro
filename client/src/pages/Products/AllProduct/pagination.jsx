"use client"

import { Button } from "@/components/ui/button"

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1
            const isCurrentPage = page === currentPage

            // Show first page, last page, current page, and pages around current
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={isCurrentPage ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              )
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 text-gray-400">
                  ...
                </span>
              )
            }
            return null
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  )
}
