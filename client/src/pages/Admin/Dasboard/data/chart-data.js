// Chart data generators
export const generateRevenueChartData = (bookings, dateFrom, dateTo) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return []
    }

    // Group bookings by month
    const monthlyData = {}

    //Filter booking với status là completed
    bookings = bookings.filter((booking) => booking.status === "completed")

    bookings.forEach((booking) => {
      try {
        const date = new Date(booking.dateTime)
        if (isNaN(date.getTime())) {
          console.warn("Invalid date in booking:", booking)
          return
        }

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            revenue: 0,
            bookings: 0,
            target: 10000000, // 10M VND target per month
          }
        }

        monthlyData[monthKey].revenue += booking.totalPay || 0
        monthlyData[monthKey].bookings += 1
      } catch (error) {
        console.error("Error processing booking for chart:", error, booking)
      }
    })

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
  } catch (error) {
    console.error("Error generating revenue chart data:", error)
    return []
  }
}

export const generateStatusChartData = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return []
    }

    const statusCounts = bookings.reduce((acc, booking) => {
      const status = booking?.status || "unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return [
      { name: "Completed", value: statusCounts.completed || 0, color: "#10B981" },
      { name: "Confirmed", value: statusCounts.confirmed || 0, color: "#3B82F6" },
      { name: "Pending", value: statusCounts.pending || 0, color: "#F59E0B" },
      { name: "Cancelled", value: statusCounts.cancelled || 0, color: "#EF4444" },
    ].filter((item) => item.value > 0) // Only show statuses that have data
  } catch (error) {
    console.error("Error generating status chart data:", error)
    return []
  }
}

export const generateServiceRevenueData = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return []
    }

    const serviceRevenue = bookings.reduce((acc, booking) => {
      const serviceName = booking?.serviceId?.[0]?.name || "Unknown Service"
      const paid = booking?.totalPay || 0
      acc[serviceName] = (acc[serviceName] || 0) + paid
      return acc
    }, {})

    return Object.entries(serviceRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
  } catch (error) {
    console.error("Error generating service revenue data:", error)
    return []
  }
}

export const generateHourlyBookingsData = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return []
    }

    const hourlyData = {}

    // Initialize all hours (9 AM to 8 PM)
    for (let hour = 9; hour <= 20; hour++) {
      hourlyData[hour] = {
        hour: `${hour}:00`,
        bookings: 0,
      }
    }

    // Count bookings by hour
    bookings.forEach((booking) => {
      try {
        const startTime = booking?.startTime || "9:00"
        const hour = Number.parseInt(startTime.split(":")[0])
        if (hourlyData[hour]) {
          hourlyData[hour].bookings += 1
        }
      } catch (error) {
        console.error("Error processing booking time:", error, booking)
      }
    })

    return Object.values(hourlyData)
  } catch (error) {
    console.error("Error generating hourly bookings data:", error)
    return []
  }
}
