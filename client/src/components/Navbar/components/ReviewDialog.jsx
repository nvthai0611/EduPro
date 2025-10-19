// components/ReviewDialog.jsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Separator } from "@/components/ui/separator"; // **Đã sửa lỗi import ở đây**
import { toast } from "react-toastify";
import { reviewProductInCheckout } from "../../../services/user/orderService";

export const ReviewDialog = ({
    isOpen,
    onClose,
    items, // Nhận một mảng các item (sản phẩm) từ checkout
    onSubmitReview,
    checkoutId,
    loadingReview
}) => {
    // State để lưu trữ đánh giá cho từng sản phẩm
    const [reviews, setReviews] = useState({});
    const [hasReview, setHasReview] = useState([]);
    useEffect(() => {
        if (isOpen && items) {
            // Khởi tạo trạng thái đánh giá khi modal mở
            const initialReviews = items.reduce((acc, item) => {
                acc[item.product._id] = {
                    productId: item.product._id,
                    rating: 0,
                    comment: "",
                    // Bạn có thể thêm trường để kiểm tra xem sản phẩm này đã được đánh giá chưa
                    // isReviewed: item.isReviewed || false,
                };
                return acc;
            }, {});
            setReviews(initialReviews);
        }
    }, [isOpen, items]);

    useEffect(() => {
        const fetchData = async () => {
            const resData = await reviewProductInCheckout(checkoutId)
            if (resData.success) {
                setHasReview(resData.data)

            }
        }
        fetchData()
    }, [])
    const handleRatingChange = (productId, newRating) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [productId]: {
                ...prevReviews[productId],
                rating: newRating,
            },
        }));
    };

    const handleCommentChange = (productId, newComment) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [productId]: {
                ...prevReviews[productId],
                comment: newComment,
            },
        }));
    };

    const handleSubmit = () => {
        const reviewsToSubmit = Object.values(reviews).filter(
            (review) => review.rating > 0 // Chỉ gửi những đánh giá có sao
        );

        if (reviewsToSubmit.length === 0) {
            toast.error("Vui lòng đánh giá ít nhất 1 sản phẩm.");
            return;
        }


        // Gọi hàm onSubmitReview với mảng các đánh giá
        onSubmitReview(reviewsToSubmit, checkoutId);
        onClose();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    const hasReviewIds = hasReview.map((review) => review.product.toString());

    const itemsWithoutReview = items.filter(
        (item) => !hasReviewIds.includes(item.product._id.toString())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-blue-700">
                        Đánh giá sản phẩm trong đơn hàng
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Chia sẻ cảm nhận của bạn về các sản phẩm bạn đã nhận.
                    </DialogDescription>
                </DialogHeader>

                {/* Đảm bảo Separator được import đúng cách */}
                <Separator className="my-4" />

                <ScrollArea className="flex-1 pr-4 -mr-4 overflow-auto"> {/* Add padding right to account for scrollbar */}
                    <div className="space-y-6">
                        {itemsWithoutReview && itemsWithoutReview.length > 0 ? (
                            itemsWithoutReview.map((item) => (
                                <div
                                    key={item.product._id}
                                    className="flex items-start gap-4 p-4 border border-blue-100 rounded-lg bg-white shadow-sm"
                                >
                                    <img
                                        src={item.product.images[0] || "/placeholder.svg?height=80&width=80"}
                                        alt={item.product.name}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover flex-shrink-0 shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Số lượng: {item.quantity} | Tổng cộng:{" "}
                                            <span className="font-medium">{formatPrice(item.price)}</span>
                                        </p>
                                        <div className="flex items-center space-x-1 mb-3">
                                            {[...Array(5)].map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${(reviews[item.product._id]?.rating || 0) > index
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                    onClick={() => handleRatingChange(item.product._id, index + 1)}
                                                />
                                            ))}
                                        </div>
                                        <Textarea
                                            placeholder="Viết đánh giá của bạn ở đây..."
                                            value={reviews[item.product._id]?.comment || ""}
                                            onChange={(e) => handleCommentChange(item.product._id, e.target.value)}
                                            className="w-full h-20 resize-none border-blue-200 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Không có sản phẩm nào để đánh giá.</p>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-full"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loadingReview}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full shadow-lg"
                    >
                        {loadingReview && <Loader2 className="mr-2 animate-spin" />}
                        {loadingReview ? "Đánh giá..." : "Đánh giá"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};