// components/service-review-detail-modal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default function ServiceReviewDetailModal({ review, isOpen, onClose }) {
  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Chi tiết Đánh giá Dịch vụ
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Thông tin chi tiết về đánh giá dịch vụ này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">ID Đánh giá:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review._id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Chi nhánh:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review.branchId?.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Người dùng:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review.userId?.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">ID Booking:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review.bookingId}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Dịch vụ:</span>
            <span className="col-span-3 text-sm text-gray-600 dark:text-gray-400 break-all">{review.serviceId?.name}</span>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Trạng thái:</span>
            <Badge className={review.status ? "bg-green-500 text-white w-fit" : "bg-red-500 text-white w-fit"}>
              {review.status ? "Hiển thị" : "Không hiển thị"}
            </Badge>
          </div>
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
