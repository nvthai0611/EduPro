"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Package, Calendar, Truck, Calculator, CheckCircle, Sparkles, ShoppingBag, Star, DollarSign } from "lucide-react";
import { getUserCheckouts, reviewProduct } from "../../../services/user/orderService";
import { ReviewDialog } from "./ReviewDialog"; // Import the new component
import { toast } from "react-toastify";

// Animated Shipping Timeline Component (Không đổi)
const ShippingTimeline = ({ status }) => {
  const steps = [
    {
      key: "pending",
      title: "Thanh toán khi nhận hàng",
      subtitle: "Hoàn thành",
      icon: "💳",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      key: "processing",
      title: "Xử lý đơn hàng",
      subtitle: "",
      icon: "📦",
      color: "from-amber-400 to-orange-500",
    },
    {
      key: "shipped",
      title: "Đã vận chuyển",
      subtitle: "",
      icon: "🚚",
      color: "from-blue-400 to-blue-600",
    },
    {
      key: "delivered",
      title: "Đã giao hàng",
      subtitle: "",
      icon: "✅",
      color: "from-green-400 to-green-600",
    },
  ];

  const statusOrder = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(status);

  const getStepStatus = (stepKey) => {
    const stepIndex = statusOrder.indexOf(stepKey);
    if (stepKey === "pending") return "completed";
    if (stepKey === "processing" && status !== "pending") return "completed";
    if (stepIndex <= currentIndex) return "completed";
    return "pending";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Trạng thái đơn hàng
        </h3>
      </div>

      <div className="relative">
        {/* Animated Progress Line */}
        <div className="absolute top-10 left-10 right-10 h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{
              width:
                status === "pending"
                  ? "0%"
                  : status === "processing"
                    ? "33%"
                    : status === "shipped"
                      ? "66%"
                      : status === "delivered"
                        ? "100%"
                        : "0%",
            }}
          />
        </div>

        {/* Animated Steps */}
        <div className="flex justify-between relative">
          {steps.map((step) => {
            const stepStatus = getStepStatus(step.key);
            const isCompleted = stepStatus === "completed";

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-4 border-4 transition-all duration-500 transform hover:scale-110 ${isCompleted
                    ? `bg-gradient-to-r ${step.color} border-white text-white shadow-xl animate-pulse`
                    : "bg-gradient-to-r from-gray-200 to-gray-300 border-gray-400 text-gray-500"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8 text-white animate-bounce" />
                  ) : (
                    <span className="text-xl">{step.icon}</span>
                  )}
                </div>
                <div className="max-w-24">
                  <p className={`text-sm font-bold mb-1 ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                      {step.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Status Message */}
      <div className="mt-8 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl py-4 px-6 text-center font-bold shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 animate-spin" />
          <span>Trạng thái đơn hàng đã được cập nhật</span>
          <Star className="w-5 h-5 animate-spin" />
        </div>
      </div>
    </div>
  );
};

// getStatusInfo (Không đổi)
const getStatusInfo = (status) => {
  const statusMap = {
    pending: {
      label: "Chờ xử lý",
      color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
      icon: Package,
    },
    processing: {
      label: "Đang xử lý",
      color: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300",
      icon: Package,
    },
    shipped: {
      label: "Đã vận chuyển",
      color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300",
      icon: Truck,
    },
    delivered: {
      label: "Đã giao hàng",
      color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300",
      icon: CheckCircle,
    },
  };
  return statusMap[status] || statusMap.pending;
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  // New states for review dialog
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [productsToReview, setProductsToReview] = useState([]);
  const [checkoutIdToReview, setCheckoutIdToReview] = useState(null); // State mới để lưu checkoutId
  useEffect(() => {
    const fetchCheckouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserCheckouts();
        setCheckouts(res.data || []);
      } catch (err) {
        if (err && (err.status === 404 || err.statusCode === 404)) {
          setCheckouts([]);
        } else {
          setError("Không thể tải đơn hàng. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCheckouts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateDetail = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = (checkout) => {
    return (checkout.totalAmount || 0) + (checkout.shippingFee || 0);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Function to open review dialog for multiple products in an order
  const handleReviewOrderProducts = (orderItems, checkoutId) => {
    setProductsToReview(orderItems);
    setCheckoutIdToReview(checkoutId); // Lưu checkoutId vào state
    setIsReviewDialogOpen(true);
  };

  // Placeholder function for submitting the review
  const handleSubmitReviews = async (reviewsData, checkoutId) => {
    console.log("Submitting reviews:", reviewsData);
    console.log("Associated Checkout ID:", checkoutIdToReview); // Sử dụng checkoutIdToReview ở đây

    try {
      setLoadingReview(true);
      const review = await reviewProduct(checkoutId, reviewsData);
      if (review.success) {
        console.log(review.data);

        setLoadingReview(false);
        toast.success(review.message);
        setIsReviewDialogOpen(false);
        setProductsToReview([]); // Clear products to review
        setCheckoutIdToReview(null); // Clear checkoutId

      } else {
        toast.error(review.message);
        setLoadingReview(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoadingReview(false);
    }
    // In a real application, you would iterate over reviewsData and make API calls
    // for each review, or send a batch of reviews to your backend.
    // Ensure you send the checkoutId with your review API call if needed for backend logic.
    // reviewsData.forEach(async (review) => {
    //   console.log(`Review for product ${review.productId}: Rating ${review.rating}, Comment "${review.comment}"`);
    //   // CALL YOUR API HERE to save each review, passing checkoutId if your API expects it
    //   // Eg: await reviewProduct({
    //   //   productId: review.productId,
    //   //   rating: review.rating,
    //   //   comment: review.comment,
    //   //   checkoutId: checkoutIdToReview // Pass checkoutId here
    //   // });
    // });


  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Animated Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-10 h-10 text-blue-600 animate-bounce" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Đơn hàng của tôi
            </h1>
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
          </div>
          <p className="text-lg text-blue-700 font-medium">Theo dõi và quản lý đơn hàng của bạn một cách dễ dàng</p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="border-blue-300 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700 font-bold text-lg">Đang tải đơn hàng...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-red-600 font-medium">{error}</span>
            </CardContent>
          </Card>
        )}
        {/* Orders List */}
        {!loading && !error && checkouts.length > 0 && (
          <div className="space-y-6">
            {checkouts.map((checkout, index) => {
              const statusInfo = getStatusInfo(checkout.statusShipping);
              const total = calculateTotal(checkout);

              return (
                <Card
                  key={checkout._id}
                  className="border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-white to-blue-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Order ID & Date */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-bold text-gray-900 text-lg">#{checkout.orderCode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>{formatDate(checkout.createdAt)}</span>
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div className="lg:col-span-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Sản phẩm</p>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {checkout.items.slice(0, 3).map((item) => (
                              <img
                                key={item._id}
                                src={item.product.images[0] || "/placeholder.svg?height=40&width=40"}
                                alt={item.product.name}
                                width={40}
                                height={40}
                                className="rounded-full border-3 border-white object-cover shadow-lg hover:scale-110 transition-transform duration-200"
                              />
                            ))}
                            {checkout.items.length > 3 && (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 border-3 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                +{checkout.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{checkout.items.length} sản phẩm</p>
                            <p className="text-xs text-blue-600 font-medium">
                              {checkout.items.reduce((sum, item) => sum + item.quantity, 0)} món
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-2">
                        <Badge className={`${statusInfo.color} font-bold px-4 py-2 text-sm shadow-lg`}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Total & Action */}
                      <div className="lg:col-span-3 text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                          {formatPrice(total)}
                        </p>
                        <Button
                          onClick={() => handleViewDetail(checkout)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && checkouts.length === 0 && (
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Order Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-gradient-to-br from-white to-blue-50">
            <DialogHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                    <span>Chi tiết đơn hàng #{selectedOrder?.orderCode}</span>
                  </div>
                </div>
                {/* Conditionally render review badge or status badge */}
                {selectedOrder?.statusShipping === "delivered" ? (
                  <Badge
                    onClick={() => handleReviewOrderProducts(selectedOrder.items, selectedOrder._id)} // Truyền toàn bộ mảng items và checkoutId
                    className="font-bold px-4 py-2 shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <Star className="h-6 w-6" />
                    </div>
                    <span>Đánh giá sản phẩm</span>
                  </Badge>
                ) : (
                  <Badge
                    className={`${getStatusInfo(selectedOrder?.statusShipping).color} font-bold px-4 py-2 shadow-lg`}
                  >
                    {React.createElement(getStatusInfo(selectedOrder?.statusShipping)?.icon, {
                      className: "h-4 w-4 mr-2",
                    })}
                    {getStatusInfo(selectedOrder?.statusShipping)?.label}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <ScrollArea className="max-h-[calc(95vh-140px)]">
                <div className="p-8 space-y-8">
                  {/* Enhanced Shipping Timeline */}
                  <ShippingTimeline status={selectedOrder.statusShipping} />

                  {/* Enhanced Order Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
                    <h3 className="font-bold text-xl text-blue-900 mb-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      Thông tin đơn hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-700">Mã đơn hàng:</span>
                          <span className="text-gray-900 font-semibold">#{selectedOrder.orderCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Ngày đặt: {formatDateDetail(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-700">Địa chỉ giao hàng:</span>
                          <span className="text-gray-600">{selectedOrder.shippingAddress}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-700">Trạng thái vận chuyển:</span>
                          <Badge className={`${getStatusInfo(selectedOrder.statusShipping).color} text-xs font-bold`}>
                            {getStatusInfo(selectedOrder.statusShipping).label}
                          </Badge>
                        </div>
                        {selectedOrder.note && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-gray-700">Ghi chú:</span>
                            <span className="text-gray-600 bg-yellow-100 px-2 py-1 rounded-lg">
                              {selectedOrder.note}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Order Items */}
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                      Sản phẩm trong đơn hàng ({selectedOrder.items.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item._id}
                          className="border border-blue-200 rounded-xl p-6 bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex gap-6">
                            {/* Enhanced Product Image */}
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <img
                                  src={item.product.images[0] || "/placeholder.svg?height=100&width=100"}
                                  alt={item.product.name}
                                  width={100}
                                  height={100}
                                  className="rounded-xl border-2 border-blue-200 object-cover shadow-lg hover:scale-105 transition-transform duration-200"
                                />
                                {/* Changed individual product review button logic */}
                                {/* {selectedOrder.statusShipping === "delivered" && (
                                  <div
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center cursor-pointer"
                                    onClick={() => handleReviewOrderProducts([item], selectedOrder._id)} // Truyền 1 mảng chứa sản phẩm này và checkoutId
                                    title="Đánh giá sản phẩm này"
                                  >
                                    <Star className="h-3 w-3 text-white" />
                                  </div>
                                )} */}
                              </div>
                            </div>

                            {/* Enhanced Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg mb-2">{item.product.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.product.description}</p>
                                  <div className="flex items-center gap-6 text-sm">
                                    <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                      Số lượng: <span className="font-bold text-gray-900">{item.quantity}</span>
                                    </span>
                                    <span className="text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                                      Đơn giá:{" "}
                                      <span className="font-bold text-blue-900">{formatPrice(item.product.price)}</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Enhanced Price */}
                                <div className="text-right">
                                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatPrice(item.price)}
                                  </div>
                                  {item.quantity > 1 && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      {formatPrice(item.product.price)} x {item.quantity}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Order Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
                    <h3 className="font-bold text-xl text-blue-900 mb-6 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                        <Calculator className="h-4 w-4 text-white" />
                      </div>
                      Tổng kết đơn hàng
                    </h3>
                    <div className="space-y-4">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600 font-medium">
                          Tạm tính ({selectedOrder.items.length} sản phẩm)
                        </span>
                        <span className="font-bold text-lg">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>

                      {/* Shipping Fee */}
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600 font-medium flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-blue-500" />
                          Phí vận chuyển
                        </span>
                        <span className="font-bold text-lg">
                          {selectedOrder.shippingFee === 0 ? (
                            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">Miễn phí</span>
                          ) : (
                            formatPrice(selectedOrder.shippingFee)
                          )}
                        </span>
                      </div>

                      <Separator className="my-4" />

                      {/* Total */}
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                        <span className="font-bold text-xl">Tổng cộng</span>
                        <span className="font-bold text-2xl">{formatPrice(calculateTotal(selectedOrder))}</span>
                      </div>

                      {/* Savings */}
                      {selectedOrder.shippingFee === 0 && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl p-4 mt-4">
                          <p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />🎉 Đơn hàng được miễn phí vận chuyển!
                            <Sparkles className="w-5 h-5" />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Products Dialog */}
        {productsToReview.length > 0 && ( // Kiểm tra mảng có sản phẩm mới hiển thị
          <ReviewDialog
            isOpen={isReviewDialogOpen}
            onClose={() => setIsReviewDialogOpen(false)}
            items={productsToReview} // Truyền mảng các item sản phẩm
            onSubmitReview={handleSubmitReviews}
            checkoutId={checkoutIdToReview} // Truyền checkoutId vào ReviewDialog
            loadingReview={loadingReview}
          />
        )}
      </div>
    </div>
  );
}