import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.fullName} />
          <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(review.user.fullName)}</AvatarFallback>
        </Avatar>

        {/* Review Content */}
        <div className="flex-1">
          {/* User Info and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.user.fullName}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
          </div>

          {/* Review Comment */}
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
