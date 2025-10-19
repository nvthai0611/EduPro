"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../../utils/clientAxios"

// API Functions - Chỉ cần 1 request cho cả tuần
const fetchBookingsForWeek = async (startDate) => {
    const dateString = startDate.toISOString().split("T")[0] // Format: YYYY-MM-DD
    const response = await apiClient.get(`/staff/booking/week?date=${dateString}`)

    if (!response.success) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch bookings")
    }
    return response.data || []
}

// Utility Functions
const transformBookingData = (booking) => {
    return {
        _id: booking._id,
        customerId: booking.customerId?._id,
        customerName: booking.customerId.fullName,
        branchId: booking.branchId._id,
        staffId: booking.staffId.map((staff) => staff._id),
        staffNames: booking.staffId.map((staff) => staff.userId.fullName),
        serviceId: booking.serviceId.map((service) => service._id),
        serviceNames: booking.serviceId.map((service) => service.name),
        roomId: booking.roomId.map((room) => room._id),
        roomNames: booking.roomId.map((room) => room.code),
        startTime: booking.startTime,
        dateTime: new Date(booking.dateTime),
        duration: booking.duration,
        totalPrice: booking.totalPrice,
        totalPaid: booking.totalPaid,
        status: booking.status,
        notes: booking.notes,
        type: booking.type,
    }
}
// done
const getStatusColor = (status) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 border-green-300 text-green-800"
        case "pending":
            return "bg-yellow-100 border-yellow-300 text-yellow-800"
        case "cancelled":
            return "bg-red-100 border-red-300 text-red-800"
        case "completed":
            return "bg-green-100 border-green-300 text-green-800"
        case "no_show":
            return "bg-gray-100 border-gray-300 text-gray-800"
        default:
            return "bg-gray-100 border-gray-300 text-gray-800"
    }
}

const getStatusText = (status) => {
    switch (status) {
        case "confirmed":
            return "Đã xác nhận"
        case "pending":
            return "Chờ xác nhận"
        case "cancelled":
            return "Đã hủy"
        case "completed":
            return "Đã hoàn thành"
        default:
            return "Không đến"
    }
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)
}

const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + i)
        week.push(currentDate)
    }
    return week
}

const getDayName = (date) => {
    const days = ["CHỦ NHẬT", "THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7"]
    return days[date.getDay()]
}

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

const timeSlots = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
]

// Components
const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
    </div>
)

const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p className="text-lg font-semibold">Có lỗi xảy ra</p>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Thử lại
            </button>
        )}
    </div>
)

const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className="relative inline-block">
            <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
                {children}
            </div>
            {isVisible && (
                <div className="absolute z-50 right-0 top-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-sm">
                    {content}
                </div>
            )}
        </div>
    )
}

const BookingCard = ({ booking, overlappingCount = 0, overlappingIndex = 0 }) => {
    const duration = booking.duration
    const height = Math.max((duration / 30) * 50, 40)

    const width = overlappingCount > 1 ? `${100 / overlappingCount}%` : "100%"
    const leftOffset = overlappingCount > 1 ? `${(overlappingIndex * 100) / overlappingCount}%` : "0%"

    const tooltipContent = (
        <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">👤 {booking.customerName}</div>
            <div className="flex items-center gap-2">
                🕐 {booking.startTime} ({booking.duration} phút)
            </div>
            <div className="flex items-center gap-2">📍 {booking.roomNames?.join(", ")}</div>
            <div className="flex items-center gap-2">💰 {formatCurrency(booking.totalPrice)}</div>
            <div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                </span>
            </div>
            <div className="text-sm">
                <strong>Dịch vụ:</strong> {booking.serviceNames.join(", ")}
            </div>
            <div className="text-sm">
                <strong>Nhân viên:</strong> {booking.staffNames.join(", ")}
            </div>
            {booking.notes && (
                <div className="text-sm">
                    <strong>Ghi chú:</strong> {booking.notes}
                </div>
            )}
        </div>
    )

    return (
        <Tooltip content={tooltipContent}>
            <div
                className={`absolute rounded-lg border-l-4 p-2 text-xs cursor-pointer transition-all hover:shadow-lg hover:z-50 ${getStatusColor(booking.status)}`}
                style={{
                    height: `${100}px`,
                    width: "100px",
                    left: leftOffset,
                    right: overlappingCount > 1 ? "auto" : "4px",
                }}
            >
                <div className="font-semibold truncate text-xs">{booking.customerName}</div>
                <div className="text-xs opacity-75 truncate mt-1">{booking.serviceNames[0]}</div>
                <div className="text-xs opacity-75 mt-1">
                    {booking.startTime} ({duration}p)
                </div>
                {booking.roomNames && <div className="text-xs opacity-60 truncate mt-1">{booking.roomNames[0]}</div>}
            </div>
        </Tooltip>
    )
}

// Custom Hook - Đã được tối ưu chỉ gọi 1 API
const useBookingsForWeek = (startDate) => {
    const dateString = startDate.toISOString().split("T")[0]

    return useQuery({
        queryKey: ["bookings", "week", dateString],
        queryFn: () => fetchBookingsForWeek(startDate),
        staleTime: 2 * 60 * 1000, // 2 minutes - giảm thời gian cache để data fresh hơn
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Tắt auto refetch khi focus để giảm request
        retry: 2, // Giảm số lần retry
        retryDelay: 1000, // 1 second delay between retries
    })
}

// Main Component
const BookingCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [searchTerm, setSearchTerm] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false)

    const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
    const weekStartDate = weekDates[0]

    // Chỉ 1 API call cho cả tuần
    const { data: bookingsData, isLoading, error, refetch, isFetching } = useBookingsForWeek(weekStartDate)

    // Transform and filter bookings
    const transformedBookings = useMemo(() => {
        if (!bookingsData) return []
        return bookingsData.map(transformBookingData)
    }, [bookingsData])

    const filteredBookings = useMemo(() => {
        return transformedBookings.filter((booking) => {
            const matchesSearch =
                searchTerm === "" ||
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceNames.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
                booking.staffNames.some((staff) => staff.toLowerCase().includes(searchTerm.toLowerCase()))
            return matchesSearch
        })
    }, [transformedBookings, searchTerm])

    const getBookingsForDate = (date) => {
        return filteredBookings.filter((booking) => {
            const bookingDate = new Date(booking.dateTime)
            return bookingDate.toDateString() === date.toDateString()
        })
    }

    const getBookingPosition = (booking) => {
        const bookingMinutes = timeToMinutes(booking.startTime)
        const startMinutes = timeToMinutes("07:00")
        const relativeMinutes = bookingMinutes - startMinutes
        return (relativeMinutes / 30) * 50
    }

    const navigateWeek = (direction) => {
        const newDate = new Date(selectedDate)
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7))
        setSelectedDate(newDate)
    }

    const isToday = (date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const handleRefresh = () => {
        refetch()
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="p-6">
                            <ErrorMessage message={error.message || "Không thể tải dữ liệu booking"} onRetry={handleRefresh} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                📅 Lịch Booking Spa
                                {isFetching && <div className="animate-spin text-blue-600">🔄</div>}
                            </h1>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm khách hàng, dịch vụ, nhân viên..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
                                </div>

                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={isFetching}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <span className={isFetching ? "animate-spin" : ""}>🔄</span>
                                    {isFetching ? "Đang tải..." : "Làm mới"}
                                </button>

                                {/* Date Navigation */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigateWeek("prev")}
                                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        ←
                                    </button>
                                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-white min-w-56 text-center">
                                        📅 {weekDates[0].toLocaleDateString("vi-VN")} - {weekDates[6].toLocaleDateString("vi-VN")}
                                    </div>
                                    <button
                                        onClick={() => navigateWeek("next")}
                                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="p-6">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="text-sm font-semibold text-gray-700">Trạng thái booking:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                                <span className="text-sm font-medium">Chờ xác nhận</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                                <span className="text-sm font-medium">Đã xác nhận</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                                <span className="text-sm font-medium">Đã hủy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                                <span className="text-sm font-medium">Đã Hoàn thành</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                                <span className="text-sm font-medium">Không đến</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-lg shadow-xl">
                    <div className="p-0">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[900px]">
                                    {/* Header Row */}
                                    <div className="grid grid-cols-8 border-b-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <div className="p-4 text-sm font-bold text-gray-700 border-r-2 bg-gray-50">Thời gian</div>
                                        {weekDates.map((date, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 text-center border-r-2 last:border-r-0 ${isToday(date) ? "bg-blue-100 border-blue-300" : ""
                                                    }`}
                                            >
                                                <div className={`text-sm font-semibold ${isToday(date) ? "text-blue-700" : "text-gray-600"}`}>
                                                    {getDayName(date)}
                                                </div>
                                                <div className={`text-xl font-bold ${isToday(date) ? "text-blue-800" : "text-gray-800"}`}>
                                                    {date.getDate()}/{date.getMonth() + 1}
                                                </div>
                                                {isToday(date) && <div className="text-xs text-blue-600 font-medium">Hôm nay</div>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="relative">
                                        {timeSlots.map((timeSlot, timeIndex) => (
                                            <div
                                                key={timeSlot}
                                                className="grid grid-cols-8 border-b hover:bg-gray-50"
                                                style={{ height: "50px" }}
                                            >
                                                <div className="p-3 text-sm font-medium text-gray-700 border-r-2 bg-gray-50 flex items-center justify-center">
                                                    {timeSlot}
                                                </div>
                                                {weekDates.map((date, dateIndex) => {
                                                    const dayBookings = getBookingsForDate(date)

                                                    const bookingsInSlot = dayBookings.filter((booking) => {
                                                        const bookingMinutes = timeToMinutes(booking.startTime)
                                                        const slotMinutes = timeToMinutes(timeSlot)
                                                        return bookingMinutes >= slotMinutes && bookingMinutes < slotMinutes + 30
                                                    })

                                                    return (
                                                        <div
                                                            key={`${timeSlot}-${dateIndex}`}
                                                            className={`border-r-2 last:border-r-0 relative ${isToday(date) ? "bg-blue-50/30" : ""}`}
                                                        >
                                                            {bookingsInSlot.map((booking, bookingIndex) => {
                                                                const position = getBookingPosition(booking)
                                                                const slotPosition = timeIndex * 50
                                                                const topOffset = position - slotPosition

                                                                return (
                                                                    <div
                                                                        key={booking._id}
                                                                        className="absolute inset-x-1"
                                                                        style={{
                                                                            top: `${topOffset}px`,
                                                                            zIndex: 10 + bookingIndex,
                                                                        }}
                                                                    >
                                                                        <BookingCard
                                                                            booking={booking}
                                                                            overlappingCount={bookingsInSlot.length}
                                                                            overlappingIndex={bookingIndex}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="bg-white rounded-lg shadow-lg mt-6">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thống kê tuần</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-3xl font-bold text-green-600">
                                    {filteredBookings.filter((b) => b.status === "confirmed").length}
                                </div>
                                <div className="text-sm font-medium text-green-700 mt-1">Đã xác nhận</div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="text-3xl font-bold text-yellow-600">
                                    {filteredBookings.filter((b) => b.status === "pending").length}
                                </div>
                                <div className="text-sm font-medium text-yellow-700 mt-1">Chờ xác nhận</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0))}
                                </div>
                                <div className="text-sm font-medium text-blue-700 mt-1">Tổng doanh thu</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">{filteredBookings.length}</div>
                                <div className="text-sm font-medium text-purple-700 mt-1">Tổng lịch hẹn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingCalendar
