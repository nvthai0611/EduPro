"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueCards from "./revenue-cards"
import BookingFilters from "./booking-filters"
import OrdersTable from "./orders-table"
import Pagination from "./pagination"
import RevenueChart from "./charts/revenue-chart"
import StatusPieChart from "./charts/status-pie-chart"
import ServiceRevenueChart from "./charts/service-revenue-chart"
import HourlyBookingsChart from "./charts/hourly-bookings-chart"
import ChartFilters from "./chart-filters"
// import { allBookings } from "./data/mock-bookings"
import {
  generateRevenueChartData,
  generateStatusChartData,
  generateServiceRevenueData,
  generateHourlyBookingsData,
} from "./data/chart-data"
import {
  calculateTotalRevenue,
  calculatePendingRevenue,
  calculateCompletedBookings,
  calculateCompletionRate,
} from "./utils/revenue-calculations"
import { filterBookings, paginateBookings } from "./utils/booking-filters"
import { ITEMS_PER_PAGE } from "./constants/ITEM"
import { getDashboardStats } from "../../../services/admin/dashboardService"
// import { getBranches } from "../../../services/admin/branchService"

export default function RevenueDashboard() {
  // Table filters
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [branchFilter, setBranchFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [allBookings, setAllBookings] = useState([]) // This should be fetched from your API or data source
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30) // 30 days ago
    return date
  })
  const [dateTo, setDateTo] = useState(new Date()) // Today
  const [checkDate, setCheckDate] = useState(30)

  // Chart filters (separate from table filters)
  const [chartDateFrom, setChartDateFrom] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30) // 30 days ago
    return date
  })
  const [chartDateTo, setChartDateTo] = useState(new Date()) // Today

  // Processed data states
  const [filteredBookings, setFilteredBookings] = useState([])
  const [chartFilteredBookings, setChartFilteredBookings] = useState([])
  const [paginatedBookings, setPaginatedBookings] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [startIndex, setStartIndex] = useState(0)

  // Revenue data states
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [pendingRevenue, setPendingRevenue] = useState(0)
  const [completedBookings, setCompletedBookings] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)

  // Chart data states
  const [revenueChartData, setRevenueChartData] = useState([])
  const [statusChartData, setStatusChartData] = useState([])
  const [serviceRevenueData, setServiceRevenueData] = useState([])
  const [hourlyBookingsData, setHourlyBookingsData] = useState([])
  const [isLoading, setIsLoading] = useState(true) // ✅ Thêm loading state
  const [isActiveDateRange, setIsActiveDateRange] = useState(30)
  const [branch, setBranch] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true) // ✅ Bắt đầu loading
      const response = await getDashboardStats()
      const getAllBranchs = await getAllBranch()
      if (response?.success) {
        setAllBookings(response.data || [])
      } else {
        setAllBookings([])
      }

      if (getAllBranchs?.success) {
        setBranch(getAllBranchs.data || [])
      } else {
        setBranch([])
      }
      setIsLoading(false) // ✅ Kết thúc loading
    }

    fetchData()
  }, [])

  // Filter bookings for table
  useEffect(() => {
    try {
      const filtered = filterBookings(allBookings, {
        statusFilter,
        searchTerm,
        dateFrom,
        dateTo,
        branchFilter
      })
      setFilteredBookings(filtered)
    } catch (error) {
      console.error("Error filtering bookings:", error)
      setFilteredBookings([])
    }
  }, [allBookings, statusFilter, searchTerm, dateFrom, dateTo, branchFilter]) // phải thêm allBookings để nó load useEffect nếu có allBookings

  // Filter bookings for charts
  useEffect(() => {
    try {
      const chartFiltered = filterBookings(allBookings, {
        statusFilter: "all", // Charts show all statuses
        searchTerm: "", // Charts don't use search
        dateFrom: chartDateFrom,
        dateTo: chartDateTo,
        branchFilter,

      })


      setChartFilteredBookings(chartFiltered)
    } catch (error) {
      console.error("Error filtering chart bookings:", error)
      setChartFilteredBookings([])
    }
  }, [allBookings, chartDateFrom, chartDateTo, branchFilter])



  // Update pagination when filtered bookings change
  useEffect(() => {
    try {
      const paginationResult = paginateBookings(filteredBookings, currentPage, ITEMS_PER_PAGE)
      setPaginatedBookings(paginationResult.paginatedBookings)
      setTotalPages(paginationResult.totalPages)
      setStartIndex(paginationResult.startIndex)
    } catch (error) {
      console.error("Error paginating bookings:", error)
      setPaginatedBookings([])
      setTotalPages(0)
      setStartIndex(0)
    }
  }, [filteredBookings, currentPage])

  // Update revenue calculations when chart filtered bookings change
  useEffect(() => {
    try {
      setTotalRevenue(calculateTotalRevenue(chartFilteredBookings))
      setPendingRevenue(calculatePendingRevenue(chartFilteredBookings))
      setCompletedBookings(calculateCompletedBookings(chartFilteredBookings))
      setCompletionRate(calculateCompletionRate(chartFilteredBookings))
      setTotalBookings(chartFilteredBookings.length)
    } catch (error) {
      console.error("Error calculating revenue:", error)
      setTotalRevenue(0)
      setPendingRevenue(0)
      setCompletedBookings(0)
      setCompletionRate(0)
      setTotalBookings(0)
    }
  }, [chartFilteredBookings])

  // Update chart data when chart filtered bookings change
  useEffect(() => {
    try {
      setRevenueChartData(generateRevenueChartData(chartFilteredBookings, chartDateFrom, chartDateTo))
      setStatusChartData(generateStatusChartData(chartFilteredBookings))
      setServiceRevenueData(generateServiceRevenueData(chartFilteredBookings))
      setHourlyBookingsData(generateHourlyBookingsData(chartFilteredBookings))
    } catch (error) {
      console.error("Error generating chart data:", error)
      setRevenueChartData([])
      setStatusChartData([])
      setServiceRevenueData([])
      setHourlyBookingsData([])
    }
  }, [chartFilteredBookings, chartDateFrom, chartDateTo])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const resetToDefaultDates = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    setDateFrom(thirtyDaysAgo)
    setIsActiveDateRange(30)
    setDateTo(today)
    setCurrentPage(1) // Reset to first page when changing filters
  }

  const setQuickDateRange = (days) => {
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - days)
    setIsActiveDateRange(days)
    setDateFrom(startDate)
    setDateTo(today)
    setCurrentPage(1)
  }

  const setChartQuickDateRange = (days) => {
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - days)
    setCheckDate(days)
    setChartDateFrom(startDate)
    setChartDateTo(today)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Quản lý doanh thu và đặt lịch
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Theo dõi hiệu suất kinh doanh của bạn và quản lý đặt chỗ</p>
        </div>

        {/* Chart Filters */}
        <ChartFilters
          chartDateFrom={chartDateFrom}
          setChartDateFrom={setChartDateFrom}
          chartDateTo={chartDateTo}
          checkDate={checkDate}
          setChartDateTo={setChartDateTo}
          setChartQuickDateRange={setChartQuickDateRange}
          totalBookings={totalBookings}
          branch={branch}
          setBranch={setBranch}
          branchFilter={branchFilter}
          setBranchFilter={setBranchFilter}
        />

        {/* Revenue Cards */}
        <RevenueCards
          totalRevenue={totalRevenue}
          pendingRevenue={pendingRevenue}
          totalBookings={totalBookings}
          completedBookings={completedBookings}
          completionRate={completionRate}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueChartData} />
          <StatusPieChart data={statusChartData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceRevenueChart data={serviceRevenueData} />
          <HourlyBookingsChart data={hourlyBookingsData} />
        </div>

        {/* Orders Management */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="text-slate-800">Đơn hàng và Đặt chỗ</CardTitle>
            <CardDescription className="text-slate-600">
              Quản lý và theo dõi tất cả các đặt phòng của bạn (bộ lọc riêng biệt)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <BookingFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              resetToDefaultDates={resetToDefaultDates}
              setQuickDateRange={setQuickDateRange}
              isActiveDateRange={isActiveDateRange}
              branch={branch}
              setBranch={setBranch}
              branchFilter={branchFilter}
              setBranchFilter={setBranchFilter}
            />

            <OrdersTable bookings={paginatedBookings} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              startIndex={startIndex}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredBookings.length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
