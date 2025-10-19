"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserStatsTable from "./user-stats-table"
import BookingChart from "./booking-chart"
import FilterPanel from "./filter-panel"
import UserDetailsModal from "./user-details-modal"
import CouponAssignModal from "./coupon-assign-modal"
import UserCouponManagement from "./user-coupon-management"

export default function UserBookingDashboard({ data }) {
  const [filters, setFilters] = useState({
    search: "",
    userType: "all",
    bookingStatus: "all",
    dateRange: "all",
    sortBy: "completedBookings",
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showCouponAssign, setShowCouponAssign] = useState(false)

  const handleViewDetails = useCallback((user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }, [])

  const handleAssignCoupon = useCallback((user) => {
    setSelectedUser(user)
    setShowCouponAssign(true)
  }, [])

  // Process user statistics
  const userStats = useMemo(() => {
    if (!data?.users || !data?.bookings) return []

    const stats = data.users.map((user) => {
      const userBookings = data.bookings?.filter((booking) => booking.customerId === user._id) || []

      const completedBookings = userBookings.filter((b) => b.status === "completed").length
      const pendingBookings = userBookings.filter((b) => b.status === "pending").length
      const cancelledBookings = userBookings.filter((b) => b.status === "cancelled").length
      const totalBookings = userBookings.length
      const totalSpent = userBookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + (b.totalPay || 0), 0)

      // Monthly booking data for chart
      const monthlyBookings = Array.from({ length: 12 }, (_, i) => {
        const month = i
        return userBookings.filter((b) => {
          const bookingMonth = new Date(b.dateTime).getMonth()
          return bookingMonth === month
        }).length
      })

      return {
        ...user,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalBookings,
        totalSpent,
        monthlyBookings,
        lastBooking:
          userBookings.length > 0
            ? new Date(Math.max(...userBookings.map((b) => new Date(b.dateTime)))).toLocaleDateString("vi-VN")
            : "Chưa có",
      }
    })

    // Sort by completed bookings (completed users first)
    return stats.sort((a, b) => {
      const sortBy = filters.sortBy
      if (sortBy === "completedBookings") {
        return b.completedBookings - a.completedBookings
      }
      if (sortBy === "totalSpent") {
        return b.totalSpent - a.totalSpent
      }
      if (sortBy === "totalBookings") {
        return b.totalBookings - a.totalBookings
      }
      return 0
    })
  }, [data?.users, data?.bookings, filters.sortBy]) // More specific dependencies

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    if (!userStats.length) return []

    return userStats.filter((user) => {
      // Search filter
      const searchTerm = filters.search?.toLowerCase() || ""
      if (searchTerm) {
        const matchesName = user.fullName?.toLowerCase().includes(searchTerm)
        const matchesEmail = user.email?.toLowerCase().includes(searchTerm)
        const matchesPhone = user.phoneNumber?.includes(filters.search)

        if (!matchesName && !matchesEmail && !matchesPhone) {
          return false
        }
      }

      // User type filter
      if (filters.userType !== "all" && user.type !== filters.userType) {
        return false
      }

      // Booking status filter (based on user's booking history)
      if (filters.bookingStatus !== "all") {
        if (filters.bookingStatus === "active" && user.completedBookings === 0) {
          return false
        }
        if (filters.bookingStatus === "inactive" && user.completedBookings > 0) {
          return false
        }
      }

      return true
    })
  }, [userStats, filters.search, filters.userType, filters.bookingStatus]) // Specific filter dependencies

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const users = data?.users || []
    const bookings = data?.bookings || []

    if (!users.length && !bookings.length) {
      return {
        totalUsers: 0,
        totalBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        completionRate: 0,
      }
    }

    const totalUsers = users.length
    const totalBookings = bookings.length
    const completedBookings = bookings.filter((b) => b.status === "completed").length
    const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + (b.totalPay || 0), 0)

    return {
      totalUsers,
      totalBookings,
      completedBookings,
      totalRevenue,
      completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0,
    }
  }, [data?.users, data?.bookings]) // More specific dependencies

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê người dùng</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi hoạt động booking của khách hàng</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.completedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.completionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(overviewStats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Bảng thống kê</TabsTrigger>
          <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
          <TabsTrigger value="coupons">Quản lý Coupon</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
          <UserStatsTable users={filteredUsers} onViewDetails={handleViewDetails} onAssignCoupon={handleAssignCoupon} />
        </TabsContent>

        <TabsContent value="chart" className="space-y-4">
          <BookingChart data={data} />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <UserCouponManagement data={data} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          bookings={data.bookings.filter((b) => b.customerId === selectedUser._id)}
          isOpen={showUserDetails}
          onClose={() => setShowUserDetails(false)}
        />
      )}

      {showCouponAssign && selectedUser && (
        <CouponAssignModal
          user={selectedUser}
          coupons={data.coupons}
          isOpen={showCouponAssign}
          onClose={() => setShowCouponAssign(false)}
          onAssign={(couponData) => {
            console.log("Assign coupon:", couponData)
            // Here you would typically make an API call
            setShowCouponAssign(false)
          }}
        />
      )}
    </div>
  )
}
