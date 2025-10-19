"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Eye,
    Search,
    ChevronLeft,
    ChevronRight,
    Gift,
    AlertTriangle,
    CheckCircle,
    Users,
    Send,
    TrendingUp,
    Star,
} from "lucide-react"
import UserCouponsDetailsModal from "./user-coupons-details-modal"
import BulkCouponAssignModal from "./bulk-coupon-assign-modal"
import { sendGiftCoupon } from "../../../../services/admin/customer_careService"
import { toast } from "react-toastify"

const ITEMS_PER_PAGE = 5

export default function UserCouponManagement({ data = {} }) {
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        userType: "all",
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showUserCouponsDetails, setShowUserCouponsDetails] = useState(false)
    const [showBulkCouponAssign, setShowBulkCouponAssign] = useState(false)

    // Extract data with defaults - stable references
    const userCoupons = data.userCoupons || []
    const users = data.users || []
    const coupons = data.coupons || []

    // Group user coupons by user - only recalculate when data changes
    const userCouponsGrouped = useMemo(() => {
        if (userCoupons.length === 0 || users.length === 0) return []

        const userCouponsMap = new Map()

        // Group coupons by user
        userCoupons.forEach((userCoupon) => {
            const userId = userCoupon.userId
            if (!userCouponsMap.has(userId)) {
                userCouponsMap.set(userId, {
                    user: userCoupon.user || users.find((u) => u._id === userId),
                    coupons: [],
                })
            }

            // Calculate coupon status
            const now = new Date()
            const expireDate = new Date(userCoupon.expireDate)
            const daysUntilExpire = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24))

            let status = "active"
            if (userCoupon.isUsed) {
                status = "used"
            } else if (daysUntilExpire < 0) {
                status = "expired"
            } else if (daysUntilExpire <= 7) {
                status = "expiring"
            }

            userCouponsMap.get(userId).coupons.push({
                ...userCoupon,
                status,
                daysUntilExpire,
            })
        })

        // Convert to array and calculate summary stats for each user
        return Array.from(userCouponsMap.values())
            .map((userGroup) => {
                const coupons = userGroup.coupons
                const totalCoupons = coupons.length
                const activeCoupons = coupons.filter((c) => c.status === "active").length
                const expiringCoupons = coupons.filter((c) => c.status === "expiring").length
                const expiredCoupons = coupons.filter((c) => c.status === "expired").length
                const usedCoupons = coupons.filter((c) => c.status === "used").length

                return {
                    ...userGroup,
                    totalCoupons,
                    activeCoupons,
                    expiringCoupons,
                    expiredCoupons,
                    usedCoupons,
                    // Sort coupons by expiration date (expiring first)
                    coupons: coupons.sort((a, b) => {
                        if (a.status === "expiring" && b.status !== "expiring") return -1
                        if (b.status === "expiring" && a.status !== "expiring") return 1
                        return new Date(a.expireDate) - new Date(b.expireDate)
                    }),
                }
            })
            .sort((a, b) => {
                // Sort users: expiring coupons first, then by total coupons
                if (a.expiringCoupons > 0 && b.expiringCoupons === 0) return -1
                if (b.expiringCoupons > 0 && a.expiringCoupons === 0) return 1
                return b.totalCoupons - a.totalCoupons
            })
    }, [userCoupons, users])

    // Filter users - only recalculate when userCouponsGrouped or filters change
    const filteredUsers = useMemo(() => {
        if (userCouponsGrouped.length === 0) return []

        return userCouponsGrouped.filter((userGroup) => {
            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase()
                const matchesUser =
                    userGroup.user?.fullName?.toLowerCase().includes(searchTerm) ||
                    userGroup.user?.email?.toLowerCase().includes(searchTerm) ||
                    userGroup.user?.phoneNumber?.includes(filters.search)
                const matchesCoupon = userGroup.coupons.some((c) => c.coupon?.code?.toLowerCase().includes(searchTerm))

                if (!matchesUser && !matchesCoupon) return false
            }

            // Status filter
            if (filters.status !== "all") {
                if (filters.status === "hasActive" && userGroup.activeCoupons === 0) return false
                if (filters.status === "hasExpiring" && userGroup.expiringCoupons === 0) return false
                if (filters.status === "hasExpired" && userGroup.expiredCoupons === 0) return false
                if (filters.status === "hasUsed" && userGroup.usedCoupons === 0) return false
            }

            // User type filter
            if (filters.userType !== "all" && userGroup.user?.type !== filters.userType) {
                return false
            }

            return true
        })
    }, [userCouponsGrouped, filters.search, filters.status, filters.userType])

    // Pagination - only recalculate when filteredUsers or currentPage change
    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const currentUsers = filteredUsers.slice(startIndex, endIndex)

        return { totalPages, startIndex, endIndex, currentUsers }
    }, [filteredUsers, currentPage])

    // Statistics - only recalculate when userCouponsGrouped changes
    const stats = useMemo(() => {
        const totalUsers = userCouponsGrouped.length
        const totalCoupons = userCouponsGrouped.reduce((sum, ug) => sum + ug.totalCoupons, 0)
        const usersWithActive = userCouponsGrouped.filter((ug) => ug.activeCoupons > 0).length
        const usersWithExpiring = userCouponsGrouped.filter((ug) => ug.expiringCoupons > 0).length
        const totalActive = userCouponsGrouped.reduce((sum, ug) => sum + ug.activeCoupons, 0)
        const totalExpiring = userCouponsGrouped.reduce((sum, ug) => sum + ug.expiringCoupons, 0)
        const totalUsed = userCouponsGrouped.reduce((sum, ug) => sum + ug.usedCoupons, 0)

        return {
            totalUsers,
            totalCoupons,
            usersWithActive,
            usersWithExpiring,
            totalActive,
            totalExpiring,
            totalUsed,
        }
    }, [userCouponsGrouped])

    // User type statistics for bulk assignment - only recalculate when users change
    const userTypeStats = useMemo(() => {
        if (users.length === 0) return { normal: 0, loyal: 0, VIP: 0 }

        return users.reduce(
            (acc, user) => {
                if (user.type === "VIP") acc.VIP++
                else if (user.type === "loyal") acc.loyal++
                else acc.normal++
                return acc
            },
            { normal: 0, loyal: 0, VIP: 0 },
        )
    }, [users])

    // Stable event handlers - these won't change on re-renders
    const handleViewDetails = useCallback((userGroup) => {
        setSelectedUser(userGroup)
        setShowUserCouponsDetails(true)
    }, [])

    const handleBulkCouponAssign = useCallback(() => {
        setShowBulkCouponAssign(true)
    }, [])

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value
        setFilters((prev) => ({ ...prev, search: value }))
        setCurrentPage(1)
    }, [])

    const handleStatusChange = useCallback((value) => {
        setFilters((prev) => ({ ...prev, status: value }))
        setCurrentPage(1)
    }, [])

    const handleUserTypeChange = useCallback((value) => {
        setFilters((prev) => ({ ...prev, userType: value }))
        setCurrentPage(1)
    }, [])

    const handlePrevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(1, prev - 1))
    }, [])

    const handleNextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(paginationData.totalPages, prev + 1))
    }, [paginationData.totalPages])

    // Helper functions - stable references
    const getUserStatusColor = useCallback((userGroup) => {
        if (userGroup.expiringCoupons > 0) return "bg-yellow-100 text-yellow-800"
        if (userGroup.activeCoupons > 0) return "bg-green-100 text-green-800"
        if (userGroup.expiredCoupons > 0) return "bg-red-100 text-red-800"
        if (userGroup.usedCoupons > 0) return "bg-blue-100 text-blue-800"
        return "bg-gray-100 text-gray-800"
    }, [])

    const getUserStatusLabel = useCallback((userGroup) => {
        if (userGroup.expiringCoupons > 0) return `${userGroup.expiringCoupons} sắp hết hạn`
        if (userGroup.activeCoupons > 0) return `${userGroup.activeCoupons} hoạt động`
        if (userGroup.expiredCoupons > 0) return `${userGroup.expiredCoupons} đã hết hạn`
        if (userGroup.usedCoupons > 0) return `${userGroup.usedCoupons} đã dùng`
        return "Không có coupon"
    }, [])

    const getUserTypeLabel = useCallback((type) => {
        switch (type) {
            case "VIP":
                return "VIP"
            case "loyal":
                return "Thân thiết"
            default:
                return "Thường"
        }
    }, [])

    const getUserTypeColor = useCallback((type) => {
        switch (type) {
            case "VIP":
                return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            case "loyal":
                return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }, [])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý Coupon</h2>
                    <p className="text-muted-foreground">Theo dõi và gửi coupon cho khách hàng</p>
                </div>
                <Button onClick={handleBulkCouponAssign} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="h-5 w-5 mr-2" />
                    Gửi Coupon Hàng Loạt
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng có coupon</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Tổng {stats.totalCoupons} coupons</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coupon đang hoạt động</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.totalActive}</div>
                        <p className="text-xs text-muted-foreground">{stats.usersWithActive} người dùng</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.totalExpiring}</div>
                        <p className="text-xs text-muted-foreground">{stats.usersWithExpiring} người dùng</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.totalUsed}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalCoupons > 0 ? ((stats.totalUsed / stats.totalCoupons) * 100).toFixed(1) : 0}% tỷ lệ sử dụng
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bulk Assignment Section */}
            {/* <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Send className="h-5 w-5" />
                        Gửi Coupon Hàng Loạt Theo Loại Khách Hàng
                    </CardTitle>
                    <p className="text-blue-600">Chọn loại khách hàng và gửi coupon một cách nhanh chóng</p>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Users className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-600">{userTypeStats.normal}</div>
                                <div className="text-sm text-gray-700 font-medium">Khách hàng thường</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Star className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-blue-600">{userTypeStats.loyal}</div>
                                <div className="text-sm text-blue-700 font-medium">Khách hàng thân thiết</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Gift className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="text-2xl font-bold text-purple-600">{userTypeStats.VIP}</div>
                                <div className="text-sm text-purple-700 font-medium">Khách hàng VIP</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <Button onClick={handleBulkCouponAssign} size="lg" className="w-full h-16 text-lg">
                                <Gift className="h-6 w-6 mr-3" />
                                Bắt Đầu Gửi Coupon
                            </Button>
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                                Tổng cộng {userTypeStats.normal + userTypeStats.loyal + userTypeStats.VIP} khách hàng
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tên, email, SĐT, mã coupon..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={filters.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Trạng thái coupon" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="hasActive">Có coupon hoạt động</SelectItem>
                                <SelectItem value="hasExpiring">Có coupon sắp hết hạn</SelectItem>
                                <SelectItem value="hasExpired">Có coupon hết hạn</SelectItem>
                                <SelectItem value="hasUsed">Có coupon đã sử dụng</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* User Type Filter */}
                        <Select value={filters.userType} onValueChange={handleUserTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Loại khách hàng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả loại khách hàng</SelectItem>
                                <SelectItem value="normal">Khách hàng thường</SelectItem>
                                <SelectItem value="loyal">Khách hàng thân thiết</SelectItem>
                                <SelectItem value="VIP">Khách hàng VIP</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Results count */}
                        <div className="flex items-center justify-center bg-gray-50 rounded-md px-3">
                            <span className="text-sm font-medium text-gray-600">Hiển thị {filteredUsers.length} kết quả</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Danh sách khách hàng có coupon ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Khách hàng</TableHead>
                                    <TableHead className="text-center font-semibold">Tổng coupons</TableHead>
                                    <TableHead className="text-center font-semibold">Hoạt động</TableHead>
                                    <TableHead className="text-center font-semibold">Sắp hết hạn</TableHead>
                                    <TableHead className="text-center font-semibold">Đã sử dụng</TableHead>
                                    <TableHead className="font-semibold">Trạng thái</TableHead>
                                    <TableHead className="text-center font-semibold">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginationData.currentUsers.map((userGroup) => (
                                    <TableRow key={userGroup.user?._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {userGroup.user?.fullName?.charAt(0) || "U"}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{userGroup.user?.fullName || "N/A"}</div>
                                                    <div className="text-sm text-muted-foreground">{userGroup.user?.email || "N/A"}</div>
                                                    <Badge className={getUserTypeColor(userGroup.user?.type)} variant="secondary">
                                                        {getUserTypeLabel(userGroup.user?.type)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-2xl font-bold text-gray-800">{userGroup.totalCoupons}</div>
                                                <div className="text-xs text-muted-foreground">coupons</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-xl font-semibold text-green-600">{userGroup.activeCoupons}</div>
                                                <div className="text-xs text-green-600">hoạt động</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-xl font-semibold text-yellow-600">{userGroup.expiringCoupons}</div>
                                                <div className="text-xs text-yellow-600">sắp hết hạn</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-xl font-semibold text-blue-600">{userGroup.usedCoupons}</div>
                                                <div className="text-xs text-blue-600">đã dùng</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getUserStatusColor(userGroup)} variant="secondary">
                                                {getUserStatusLabel(userGroup)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(userGroup)}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Chi tiết
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {paginationData.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredUsers.length)} của{" "}
                                {filteredUsers.length} khách hàng
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                    Trước
                                </Button>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">Trang</span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {currentPage} / {paginationData.totalPages}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === paginationData.totalPages}
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {showUserCouponsDetails && selectedUser && (
                <UserCouponsDetailsModal
                    userGroup={selectedUser}
                    isOpen={showUserCouponsDetails}
                    onClose={() => setShowUserCouponsDetails(false)}
                />
            )}

            {showBulkCouponAssign && (
                <BulkCouponAssignModal
                    users={users}
                    coupons={coupons}
                    userTypeStats={userTypeStats}
                    isOpen={showBulkCouponAssign}
                    onClose={() => setShowBulkCouponAssign(false)}
                    onAssign={async (assignmentData) => {
                        console.log("Bulk assign coupons:", assignmentData)
                        try {
                            const resResponse = await sendGiftCoupon(assignmentData)
                            console.log("resResponse", resResponse);

                            if (resResponse.success) {
                                setShowBulkCouponAssign(false)
                                toast.success(resResponse.message)
                            } else {
                                toast.error(resResponse.message)
                            }
                        } catch (error) {
                            console.log("error", error);
                            toast.error(error.message);
                        }
                    }}
                />
            )}
        </div>
    )
}
