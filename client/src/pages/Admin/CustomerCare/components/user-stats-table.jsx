"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Gift, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function UserStatsTable({ users = [], onViewDetails, onAssignCoupon }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil((users?.length || 0) / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = users?.slice(startIndex, endIndex) || []

  const getUserTypeColor = (type) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800"
      case "loyal":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserTypeLabel = (type) => {
    switch (type) {
      case "VIP":
        return "VIP"
      case "loyal":
        return "Thân thiết"
      default:
        return "Thường"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách khách hàng ({users?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại KH</TableHead>
                <TableHead className="text-center">Hoàn thành</TableHead>
                <TableHead className="text-center">Tổng booking</TableHead>
                <TableHead className="text-right">Tổng chi tiêu</TableHead>
                <TableHead>Booking cuối</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers?.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{user?.fullName || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">{user?.email || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">{user?.phoneNumber || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserTypeColor(user?.type)}>{getUserTypeLabel(user?.type)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-green-600">{user?.completedBookings || 0}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium">{user?.totalBookings || 0}</div>
                      <div className="text-xs text-muted-foreground">Hủy: {user?.cancelledBookings || 0}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(user?.totalSpent || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user?.lastBooking || "N/A"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewDetails?.(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onAssignCoupon?.(user)}>
                        <Gift className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) || []}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, users?.length || 0)} của {users?.length || 0} khách hàng
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Trang {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
