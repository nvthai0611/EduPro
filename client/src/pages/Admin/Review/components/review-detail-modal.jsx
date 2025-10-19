// components/review-detail-modal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default function ReviewDetailModal({ review, isOpen, onClose }) {
  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">Chi tiết Đánh giá</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Thông tin chi tiết về đánh giá này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">ID Đánh giá:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review._id}</span>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">ID Chi nhánh:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review.branchId}</span>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Email Người dùng:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review?.userId?.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">ID Booking:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">
              {review.bookingId || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Đánh giá:</span>
            <div className="col-span-3 flex items-center gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Bình luận:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400">{review.comment}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Tùy chọn:</span>
            <div className="col-span-3 flex flex-wrap gap-1">
              {review.selectedOptions.length > 0 ? (
                review.selectedOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-600"
                  >
                    {option.label}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-600 dark:text-gray-400">Không có</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Trạng thái:</span>
            <Badge className={review.status ? "bg-green-500 text-white w-fit" : "bg-red-500 text-white w-fit"}>
              {review.status ? "Hiển thị" : "Không hiển thị"}
            </Badge>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Yêu thích:</span>
            <Badge
              className={
                review.isFavorite
                  ? "bg-pink-500 text-white w-fit"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-fit"
              }
            >
              {review.isFavorite ? "Có" : "Không"}
            </Badge>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Ngày tạo:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Cập nhật cuối:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400">
              {new Date(review.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
