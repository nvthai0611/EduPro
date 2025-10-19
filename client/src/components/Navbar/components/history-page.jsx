"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Heart,
  Gift,
  Search,
  Filter,
  Star,
  Zap,
  Crown,
  Gem,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatPriceChart, formatRawPhoneNumberReplace } from "../../../utils/format"
import { useBookingStore } from "../../../stores/zustand/bookingStore"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { isValidPhone } from "../../../utils/validation"

// Custom Carousel Component
const CustomCarousel = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)


  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <img
                src={image || "/placeholder.svg?height=400&width=800"}
                alt={`Spa image ${idx + 1}`}
                className="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => onImageClick(images, idx)}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <Button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10 p-0 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10 p-0 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${idx === currentIndex ? "bg-purple-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Image Grid Component
const ImageGrid = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, idx) => (
        <div key={idx} className="relative group cursor-pointer">
          <img
            src={image || "/placeholder.svg?height=200&width=300"}
            alt={`Spa image ${idx + 1}`}
            className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
            onClick={() => onImageClick(images, idx)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      ))}
    </div>
  )
}



export default function HistoryPage({ bookings, closeModal }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImages, setCurrentImages] = useState([])
  const [viewMode, setViewMode] = useState("carousel")

  const setSelectedBranch = useBookingStore((state) => state.setSelectedBranch);
  const setSelectedServices = useBookingStore((state) => state.setSelectedServices);
  const setTotalPrice = useBookingStore((state) => state.setTotalPrice);

  const phone = useBookingStore((state) => state.phone);

  const navigate = useNavigate();
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [spaFilter, setSpaFilter] = useState("all")

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg animate-pulse"
      case "cancelled":
        return "bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg animate-pulse"
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg animate-pulse"
      case "confirmed":
        return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg animate-pulse"
      default:
        return "bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg animate-pulse"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      case "pending":
        return "Chờ xử lý"
      case "confirmed":
        return "Đã xác nhận"
      case "no_show":
        return "Bạn đã không đến"
      default:
        return "Không xác định"
    }
  }

  const openImageModal = (images, index = 0) => {
    setCurrentImages(images)
    setSelectedImageIndex(index)
    setShowImageModal(true)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % currentImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
  }

  const handleRebook = (booking) => {

    if (!isValidPhone(phone)) {
      toast("Vui lòng nhập số điện thoại để tiếp tục đặt lịch");
      return;
    }

    setSelectedBranch(booking?.branchId);
    setSelectedServices(booking?.serviceId);
    setTotalPrice(booking?.totalPrice);
    closeModal();
    navigate(
      `/booking?phone=${formatRawPhoneNumberReplace(phone)}&step=0`
    );
  }

  // Filter bookings based on search criteria
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.serviceId.some((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        booking.branchId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.branchId.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      const matchesDate = !dateFilter || booking.dateTime.includes(dateFilter)

      const matchesSpa = spaFilter === "all" || booking?.branchId?.name === spaFilter

      return matchesSearch && matchesStatus && matchesDate && matchesSpa
    })
  }, [bookings, searchTerm, statusFilter, dateFilter, spaFilter])

  // Get unique spa names for filter
  const uniqueSpas = [...new Set(bookings?.map((booking) => booking?.branchId?.name))]

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-indigo-50 to-cyan-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slow"></div>

          {/* Floating Sparkles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-twinkle"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-twinkle-delayed"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-twinkle-slow"></div>
        </div>

        <div className="relative z-10 space-y-8 p-6">
          {/* Enhanced Header Card */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/30 via-purple-700/30 via-indigo-700/30 to-cyan-700/30 animate-gradient-shift"></div>

            {/* Floating Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-bounce-slow"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping-slow"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-4xl flex items-center gap-4 animate-slide-in-left">
                <div className="relative">
                  <Sparkles className="w-10 h-10 animate-spin-slow text-yellow-300" />
                  <div className="absolute inset-0 w-10 h-10 animate-ping">
                    <Sparkles className="w-10 h-10 text-yellow-200/50" />
                  </div>
                </div>
                Lịch Sử Làm Đẹp
                <div className="flex gap-2">
                  <Heart className="w-7 h-7 text-pink-200 animate-heartbeat" />
                  <Crown className="w-7 h-7 text-yellow-300 animate-bounce" />
                  <Gem className="w-7 h-7 text-cyan-200 animate-pulse" />
                </div>
              </CardTitle>
              <CardDescription className="text-pink-100 text-xl animate-slide-in-right">
                ✨ Khám phá lại những khoảnh khắc làm đẹp tuyệt vời của bạn tại SpaConnect ✨
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Enhanced Search and Filter Section */}
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Search className="w-6 h-6 text-purple-600 animate-pulse" />
                Tìm kiếm & Lọc
                <Filter className="w-5 h-5 text-pink-600 animate-bounce" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
                  <Input
                    placeholder="Tìm theo dịch vụ, spa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-purple-200 focus:border-purple-500 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                      <SelectItem value="no_show">Không đến</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ngày</label>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border-2 border-indigo-200 focus:border-indigo-500 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Spa</label>
                  <Select value={spaFilter} onValueChange={setSpaFilter}>
                    <SelectTrigger className="border-2 border-cyan-200 focus:border-cyan-500">
                      <SelectValue placeholder="Chọn spa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả spa</SelectItem>
                      {uniqueSpas.map((spa) => (
                        <SelectItem key={spa} value={spa}>
                          {spa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg animate-pulse">
              Tìm thấy {filteredBookings.length} kết quả
            </Badge>
          </div>

          {/* Enhanced Booking Cards - 2 per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookings.map((item, index) => (
              <Card
                key={item?._id}
                className="group relative overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white/90 backdrop-blur-lg border-0 shadow-xl animate-slide-up hover:rotate-1"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 via-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Multiple Floating Elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100"></div>
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>

                {/* Sparkle Effects */}
                <div className="absolute top-1/4 left-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Star className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                </div>
                <div className="absolute top-3/4 right-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <Zap className="w-3 h-3 text-purple-400 animate-pulse" />
                </div>

                <CardContent className="p-6 relative z-10">
                  {/* Image Section with Enhanced Effects */}
                  <div className="relative group/image mb-6">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={item?.branchId?.images[0] || "/placeholder.svg?height=250&width=400"}
                        alt="ảnh spa"
                        className="w-full h-48 object-cover group-hover/image:scale-125 group-hover/image:rotate-2 transition-all duration-1000 cursor-pointer"
                        onClick={() => openImageModal(item?.branchId?.images || [], 0)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>

                      {/* Enhanced Overlay Text */}
                      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover/image:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/image:translate-y-0">
                        <p className="text-sm font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                          ✨ Click vào chi tiết để xem thêm ảnh ✨
                        </p>
                      </div>

                      {item?.branchId?.images?.length > 1 && (
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-bounce">
                          +{item.branchId.images.length - 1} ảnh
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                          {item.serviceId.length ? item?.serviceId?.map((ser) => ser?.name)?.join(", "): "Đến tư vấn và spa chọn giúp bạn"}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-pink-500 animate-pulse" />
                          <span className="font-medium">{item?.branchId?.name}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-sm">{item?.branchId?.address}</span>
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(item?.status)} px-3 py-1 text-xs font-semibold transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {getStatusText(item?.status)}
                      </Badge>
                    </div>

                    {/* Enhanced Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <Calendar className="w-4 h-4 text-blue-500 animate-pulse" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Ngày</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(item?.dateTime).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <Clock className="w-4 h-4 text-green-500 animate-pulse" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Giờ</p>
                          <p className="text-sm font-semibold text-gray-800">{item?.startTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <Gift className="w-4 h-4 text-pink-500 animate-bounce" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Tổng tiền</p>
                          <p className="text-sm font-bold text-pink-600">{formatPriceChart(item.totalPrice)} VND</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Giảm giá</p>
                          <p className="text-sm font-bold text-purple-600">{formatPriceChart(item.totalDiscount)} VND</p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1"
                          >
                            <Eye className="w-4 h-4 animate-pulse" />
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent describedby="" className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                              {item?.serviceId?.map((ser) => ser?.name)?.join(", ")}
                            </DialogTitle>
                            <DialogDescription className="text-lg">
                              Chi tiết dịch vụ tại {item?.branchId?.name} - {item?.branchId?.address}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="flex gap-2 justify-center">
                              <Button
                                onClick={() => setViewMode("carousel")}
                                variant={viewMode === "carousel" ? "default" : "outline"}
                                size="sm"
                              >
                                Carousel
                              </Button>
                              <Button
                                onClick={() => setViewMode("grid")}
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                              >
                                Grid
                              </Button>
                            </div>

                            {viewMode === "carousel" ? (
                              <CustomCarousel images={item?.branchId?.images || []} onImageClick={openImageModal} />
                            ) : (
                              <ImageGrid images={item?.branchId?.images || []} onImageClick={openImageModal} />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md">
                                <CardHeader>
                                  <CardTitle className="text-lg text-blue-700">Thông tin dịch vụ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Ngày:</span>
                                    <span className="font-semibold">
                                      {new Date(item.dateTime).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Giờ:</span>
                                    <span className="font-semibold">{item.startTime}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Thời gian:</span>
                                    <span className="font-semibold">{item.duration}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-md">
                                <CardHeader>
                                  <CardTitle className="text-lg text-pink-700">Chi phí</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Tổng giá:</span>
                                    <span className="font-bold text-pink-600">
                                      {formatPriceChart(item.totalPrice)} VND
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Khuyến mãi:</span>
                                    <span className="font-bold text-green-600">
                                      -{formatPriceChart(item.totalDiscount)} VND
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t border-pink-200">
                                    <span className="font-bold text-gray-800">Thành tiền:</span>
                                    <span className="font-bold text-xl text-purple-600">
                                      {formatPriceChart(item.totalPrice - item.totalDiscount)} VND
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {item?.status === "completed" && (
                        <Button
                          onClick={() => handleRebook(item)}
                          size="sm"
                          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1"
                        >
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          Đặt lại lịch
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Image Modal with Fixed Z-Index */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-fade-in">
              <div className="relative max-w-5xl max-h-full">
                <Button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 z-[10000] bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </Button>

                {currentImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-14 h-14 p-0 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-14 h-14 p-0 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </Button>
                  </>
                )}

                <img
                  src={currentImages[selectedImageIndex] || "/placeholder.svg?height=600&width=800"}
                  alt={`Spa image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoom-in"
                />

                {currentImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-[10000]">
                    {currentImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${idx === selectedImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0; transform: scale(0); }
          25% { opacity: 1; transform: scale(1); }
          75% { opacity: 0; transform: scale(0); }
        }

        @keyframes twinkle-slow {
          0%, 100% { opacity: 0; transform: scale(0); }
          33% { opacity: 1; transform: scale(1); }
          66% { opacity: 0; transform: scale(0); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle-delayed 4s ease-in-out infinite;
        }

        .animate-twinkle-slow {
          animation: twinkle-slow 5s ease-in-out infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
      </div>
    </>
  )
}
