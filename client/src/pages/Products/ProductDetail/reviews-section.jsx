"use client"

import { useState } from "react"
import ReviewCard from "./review-card"
import RatingFilter from "./rating-filter"
import { Button } from "@/components/ui/button"
import { Star, StarHalf } from "lucide-react" // Import StarHalf

export default function ReviewsSection({ reviews }) {
  const [filteredReviews, setFilteredReviews] = useState(reviews)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRating, setSelectedRating] = useState("all")
  const reviewsPerPage = 3

  // Calculate rating statistics
  const ratingStats = {
    total: reviews.length,
    // Đảm bảo xử lý trường hợp reviews rỗng để tránh chia cho 0
    average: reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
    distribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  }

  // Handle rating filter
  const handleRatingFilter = (rating) => {
    setSelectedRating(rating)
    setCurrentPage(1)

    if (rating === "all") {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === Number.parseInt(rating)))
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const endIndex = startIndex + reviewsPerPage
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Hàm renderStars đã được chỉnh sửa để hiển thị sao lẻ
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{ratingStats.average.toFixed(1) || "0.0"}</div>
          <div className="flex justify-center mb-2">{renderStars(ratingStats.average)}</div> {/* Sử dụng ratingStats.average */}
          <p className="text-gray-600">{ratingStats.total} đánh giá</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-8">{rating} sao</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${(ratingStats.distribution[rating] / ratingStats.total) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{ratingStats.distribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <RatingFilter selectedRating={selectedRating} onRatingChange={handleRatingFilter} ratingStats={ratingStats} />

      {/* Reviews List */}
      <div className="space-y-6 mb-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => <ReviewCard key={review._id} review={review} />)
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Không có đánh giá nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-16"
          >
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
              className="w-10"
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-16"
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}