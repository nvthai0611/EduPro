"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shadcn-ui/components/ui/card"
import RevenueCards from "./components/revenue-cards"
import BookingFilters from "./components/booking-filters"
import OrdersTable from "./components/orders-table"
import Pagination from "./components/pagination"
import RevenueChart from "./components/charts/revenue-chart"
import StatusPieChart from "./components/charts/status-pie-chart"
import ServiceRevenueChart from "./components/charts/service-revenue-chart"
import HourlyBookingsChart from "./components/charts/hourly-bookings-chart"
import ChartFilters from "./components/chart-filters"
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
import { getStaffDashboardStats, getStaffDashboardComparison } from "../../../services/staff/dashboardService"
import { Loader2 } from "lucide-react"

export default function StaffDashboard() {
  // Table filters
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [allBookings, setAllBookings] = useState([])
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30) // 30 days ago
    return date
  })
  const [dateTo, setDateTo] = useState(new Date()) // Today

  // Chart filters (separate from table filters)
  const [chartDateFrom, setChartDateFrom] = useState(() => {
    const date = new Date()
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    return firstDayOfMonth
  })
  const [chartDateTo, setChartDateTo] = useState(() => {
    const date = new Date()
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return lastDayOfMonth
  })

  // Chart filter state
  const [chartFilters, setChartFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    viewType: 'month'
  })

  // Processed data states
  const [filteredBookings, setFilteredBookings] = useState([])
  const [chartFilteredBookings, setChartFilteredBookings] = useState([])
  const [paginatedBookings, setPaginatedBookings] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [startIndex, setStartIndex] = useState(0)

  // Revenue data states
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [profit, setProfit] = useState(0)
  const [completedBookings, setCompletedBookings] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)

  // Chart data states
  const [revenueChartData, setRevenueChartData] = useState([])
  const [statusChartData, setStatusChartData] = useState([])
  const [serviceRevenueData, setServiceRevenueData] = useState([])
  const [hourlyBookingsData, setHourlyBookingsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActiveDateRange, setIsActiveDateRange] = useState(30)

  // Comparison data state
  const [comparisonData, setComparisonData] = useState(null)

  // Fetch data with filters
  const fetchData = async (filters) => {
    setIsLoading(true)
    try {
      const [response, comparisonResponse] = await Promise.all([
        getStaffDashboardStats(filters),
        getStaffDashboardComparison(filters)
      ])
      
      if (response?.success) {
        setAllBookings(response.data || [])
      } else {
        setAllBookings([])
      }

      if (comparisonResponse?.success) {
        setComparisonData(comparisonResponse.data || null)
      } else {
        setComparisonData(null)
      }
    } catch (error) {
      console.error("Error fetching staff dashboard data:", error.message)
      setAllBookings([])
      setComparisonData(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData(chartFilters)
  }, [chartFilters])

  // Filter bookings for table
  useEffect(() => {
    try {
      const filtered = filterBookings(allBookings, {
        statusFilter,
        searchTerm,
        dateFrom,
        dateTo
      })
      setFilteredBookings(filtered)
    } catch (error) {
      console.error("Error filtering bookings:", error)
      setFilteredBookings([])
    }
  }, [allBookings, statusFilter, searchTerm, dateFrom, dateTo])

  // Filter bookings for charts
  useEffect(() => {
    try {
      const chartFiltered = filterBookings(allBookings, {
        statusFilter: "all", // Charts show all statuses
        searchTerm: "", // Charts don't use search
        dateFrom: chartDateFrom,
        dateTo: chartDateTo
      })
      setChartFilteredBookings(chartFiltered)
    } catch (error) {
      console.error("Error filtering chart bookings:", error)
      setChartFilteredBookings([])
    }
  }, [allBookings, chartDateFrom, chartDateTo])

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
      setCompletedBookings(calculateCompletedBookings(chartFilteredBookings))
      setCompletionRate(calculateCompletionRate(chartFilteredBookings))
      setTotalBookings(chartFilteredBookings.length)
    } catch (error) {
      console.error("Error calculating revenue:", error)
      setTotalRevenue(0)
      setCompletedBookings(0)
      setCompletionRate(0)
      setTotalBookings(0)
    }
  }, [chartFilteredBookings])

  // Update profit from comparison data
  useEffect(() => {
    if (comparisonData?.profit?.current) {
      setProfit(comparisonData.profit.current)
    } else {
      setProfit(0)
    }
  }, [comparisonData])

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

  // Handle chart filter changes
  const handleChartFilterChange = (newFilters) => {
    setChartFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
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
            Doanh Thu & Booking
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Theo dõi hiệu suất kinh doanh và booking</p>
        </div>

        {/* Chart Filters */}
        <ChartFilters
          chartDateFrom={chartDateFrom}
          setChartDateFrom={setChartDateFrom}
          chartDateTo={chartDateTo}
          setChartDateTo={setChartDateTo}
          totalBookings={totalBookings}
          branch={[]}
          setBranch={() => {}}
          branchFilter="all"
          setBranchFilter={() => {}}
          onFilterChange={handleChartFilterChange}
          filters={chartFilters}
        />

        {/* Revenue Cards */}
        <RevenueCards
          totalRevenue={totalRevenue}
          profit={profit}
          totalBookings={totalBookings}
          completedBookings={completedBookings}
          completionRate={completionRate}
          comparisonData={comparisonData}
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
            <CardTitle className="text-slate-800">Tổng quan Booking</CardTitle>
            <CardDescription className="text-slate-600">
              Theo dõi tất cả các booking
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
              branch={[]}
              setBranch={() => {}}
              branchFilter="all"
              setBranchFilter={() => {}}
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
