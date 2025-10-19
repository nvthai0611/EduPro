// components/review-management.jsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, Edit, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateFakeReviews } from "../lib/fake-data"
import ReviewDetailModal from "./review-detail-modal"
import EditStatusModal from "./edit-status-modal"
import { updateStatusReview } from "../../../../services/admin/reviewService"
import { toast } from "react-toastify"

const ITEMS_PER_PAGE = 10

export default function ReviewManagement({ reviews }) {
  const [allReviews, setAllReviews] = useState([]) // Store all data
  const [currentPage, setCurrentPage] = useState(1)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false)
  const [reviewToEdit, setReviewToEdit] = useState(null)

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'true', 'false'
  const [filterRating, setFilterRating] = useState("all") // 'all', '1', '2', '3', '4', '5'
  const [filterFavorite, setFilterFavorite] = useState("all") // 'all', 'true', 'false'

  useEffect(() => {
    if (reviews) {
      setAllReviews(reviews);
      console.log("allReviews updated from prop:", reviews);
    }
  }, [reviews]);
  const filteredAndSearchedReviews = useMemo(() => {
    let filtered = allReviews

    // Apply search
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.comment.toLowerCase().includes(lowerCaseSearchTerm) ||
          review._id.toLowerCase().includes(lowerCaseSearchTerm) ||
          review.branchId.toLowerCase().includes(lowerCaseSearchTerm) ||
          review.userId.toLowerCase().includes(lowerCaseSearchTerm) ||
          (review.bookingId && review.bookingId.toLowerCase().includes(lowerCaseSearchTerm)),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      const statusBool = filterStatus === "true"
      filtered = filtered.filter((review) => review.status === statusBool)
    }

    // Apply rating filter
    if (filterRating !== "all") {
      const ratingNum = Number.parseInt(filterRating)
      filtered = filtered.filter((review) => review.rating === ratingNum)
    }

    // Apply favorite filter
    if (filterFavorite !== "all") {
      const favoriteBool = filterFavorite === "true"
      filtered = filtered.filter((review) => review.isFavorite === favoriteBool)
    }

    return filtered
  }, [allReviews, searchTerm, filterStatus, filterRating, filterFavorite])

  const totalPages = Math.ceil(filteredAndSearchedReviews?.length / ITEMS_PER_PAGE)
  const currentReviews = filteredAndSearchedReviews?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleViewDetails = (review) => {
    setSelectedReview(review)
    setIsDetailModalOpen(true)
  }

  const handleEditStatus = (review) => {
    setReviewToEdit(review)
    setIsEditStatusModalOpen(true)
  }

  const handleSaveStatus = async (id, newStatus) => {
    try {
      const review = await updateStatusReview(id);
      console.log("review", review);

      if (review.success) {
        setAllReviews((prevReviews) =>
          prevReviews.map((review) => (review._id === id ? { ...review, status: newStatus } : review)),
        )
        toast.success("Cập nhật trang thái thành công!");
      }
      else {
        toast.error("Cập nhật trang thái bị lỗi!");
      }
    } catch (error) {
      toast.error("Cập nhật trang thái bị lỗi!");
    }
  }

  // Reset page to 1 when filters or search term change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterRating, filterFavorite])

  console.log(allReviews);

  return (
    <Card className="w-full shadow-xl rounded-lg border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-850">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">Quản lý Đánh giá</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Xem và quản lý các đánh giá của khách hàng.
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo bình luận, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50">
                <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Lọc theo Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                <SelectItem value="all">Tất cả Trạng thái</SelectItem>
                <SelectItem value="true">Hiển thị</SelectItem>
                <SelectItem value="false">Không hiển thị</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50">
                <Star className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Lọc theo Đánh giá" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                <SelectItem value="all">Tất cả Đánh giá</SelectItem>
                <SelectItem value="1">1 Sao</SelectItem>
                <SelectItem value="2">2 Sao</SelectItem>
                <SelectItem value="3">3 Sao</SelectItem>
                <SelectItem value="4">4 Sao</SelectItem>
                <SelectItem value="5">5 Sao</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFavorite} onValueChange={setFilterFavorite}>
              <SelectTrigger className="w-[180px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50">
                <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Lọc theo Yêu thích" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Yêu thích</SelectItem>
                <SelectItem value="false">Không yêu thích</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50 dark:bg-gray-700">
                {/* <TableHead className="w-[120px] text-blue-800 dark:text-blue-200">ID Chi nhánh</TableHead> */}
                <TableHead className="w-[120px] text-blue-800 dark:text-blue-200">Email Người dùng</TableHead>
                <TableHead className="w-[120px] text-blue-800 dark:text-blue-200">ID Booking</TableHead>
                <TableHead className="w-[100px] text-blue-800 dark:text-blue-200">Đánh giá</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">Bình luận</TableHead>
                <TableHead className="w-[80px] text-blue-800 dark:text-blue-200">Trạng thái</TableHead>
                {/* <TableHead className="w-[80px] text-blue-800 dark:text-blue-200">Yêu thích</TableHead> */}
                <TableHead className="w-[120px] text-blue-800 dark:text-blue-200">Ngày tạo</TableHead>
                <TableHead className="text-right w-[100px] text-blue-800 dark:text-blue-200">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReviews?.length > 0 ? (
                currentReviews?.map((review) => (
                  <TableRow key={review?._id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                    {/* <TableCell className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {review?.branchId?.substring(0, 8)}...
                    </TableCell> */}
                    <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                      {review?.userId?.email.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                      {review?.bookingId ? review?.bookingId?.substring(0, 8) + "..." : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        ))}
                        {Array.from({ length: 5 - review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-gray-700 dark:text-gray-300">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      <Badge className={review.status ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                        {review.status ? "Hiển thị" : "Không hiển thị"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <Badge
                        className={
                          review.isFavorite
                            ? "bg-pink-500 text-white"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        }
                      >
                        {review.isFavorite ? "Có" : "Không"}
                      </Badge>
                    </TableCell> */}
                    <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(review)}
                          className="hover:bg-blue-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="sr-only">Xem</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStatus(review)}
                          className="hover:bg-blue-100 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Không tìm thấy đánh giá nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Hiển thị {currentReviews?.length} trên tổng số {filteredAndSearchedReviews?.length} đánh giá
          {searchTerm || filterStatus !== "all" || filterRating !== "all" || filterFavorite !== "all"
            ? ` (đã lọc từ ${allReviews?.length})`
            : ""}{" "}
          .
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </Button>
        </div>
      </CardFooter>

      <ReviewDetailModal
        review={selectedReview}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <EditStatusModal
        item={reviewToEdit}
        isOpen={isEditStatusModalOpen}
        onClose={() => setIsEditStatusModalOpen(false)}
        onSave={handleSaveStatus}
        type="review"
      />
    </Card>
  )
}
