// Revenue calculation utilities
export const calculateTotalRevenue = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings)) {
      return 0
    }

    const completedBookings = bookings.filter(booking => booking.status === 'completed');

    return completedBookings.reduce((sum, booking) => {
      const paid = booking?.totalPay || 0
      return sum + paid
    }, 0)
  } catch (error) {
    console.error("Error calculating total revenue:", error)
    return 0
  }
}

export const calculatePendingRevenue = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings)) {
      return 0
    }
    return bookings
      .filter((booking) => booking?.status === "pending")
      .reduce((sum, booking) => {
        const totalPrice = booking?.totalPrice || 0
        const totalPay = booking?.totalPay || 0
        return sum + (totalPrice - totalPay)
      }, 0)
  } catch (error) {
    console.error("Error calculating pending revenue:", error)
    return 0
  }
}

export const calculateCompletedBookings = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings)) {
      return 0
    }
    return bookings.filter((booking) => booking?.status === "completed").length
  } catch (error) {
    console.error("Error calculating completed bookings:", error)
    return 0
  }
}

export const calculateCompletionRate = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return 0
    }
    const completed = calculateCompletedBookings(bookings)
    const total = bookings.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  } catch (error) {
    console.error("Error calculating completion rate:", error)
    return 0
  }
}

// Format currency for Vietnamese Dong
export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return "₫0"
  }
}

// Calculate average booking value
export const calculateAverageBookingValue = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return 0
    }
    const totalRevenue = calculateTotalRevenue(bookings)
    return Math.round(totalRevenue / bookings.length)
  } catch (error) {
    console.error("Error calculating average booking value:", error)
    return 0
  }
}

// Calculate revenue by branch
export const calculateRevenueByBranch = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings)) {
      return {}
    }
    return bookings.reduce((acc, booking) => {
      const branchName = booking?.branchId?.name || "Unknown"
      const paid = booking?.totalPay || 0
      acc[branchName] = (acc[branchName] || 0) + paid
      return acc
    }, {})
  } catch (error) {
    console.error("Error calculating revenue by branch:", error)
    return {}
  }
}

// Calculate revenue by service
export const calculateRevenueByService = (bookings) => {
  try {
    if (!bookings || !Array.isArray(bookings)) {
      return {}
    }
    return bookings.reduce((acc, booking) => {
      const serviceName = booking?.serviceId?.[0]?.name || "Unknown"
      const paid = booking?.totalPay || 0
      acc[serviceName] = (acc[serviceName] || 0) + paid
      return acc
    }, {})
  } catch (error) {
    console.error("Error calculating revenue by service:", error)
    return {}
  }
}
