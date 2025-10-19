import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ReviewModal({ product, reviews, isOpen, onClose }) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name} - Reviews</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{review.customer}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{review.createdAt}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-500 text-center py-8">No reviews yet</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
