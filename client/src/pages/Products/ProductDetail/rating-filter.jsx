"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function RatingFilter({ selectedRating, onRatingChange, ratingStats }) {
  const filterOptions = [
    { value: "all", label: "Tất cả", count: ratingStats.total },
    { value: "5", label: "5 sao", count: ratingStats.distribution[5] },
    { value: "4", label: "4 sao", count: ratingStats.distribution[4] },
    { value: "3", label: "3 sao", count: ratingStats.distribution[3] },
    { value: "2", label: "2 sao", count: ratingStats.distribution[2] },
    { value: "1", label: "1 sao", count: ratingStats.distribution[1] },
  ]

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Lọc theo đánh giá</h3>
      <div className="flex flex-wrap items-start  gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedRating === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onRatingChange(option.value)}
            className="flex items-center gap-1 flex-shrink-0 w-auto"
          >
            {option.value !== "all" && <Star className="w-3 h-3 fill-current" />}
            {option.label} ({option.count})
          </Button>
        ))}
      </div>
    </div>
  )
}
