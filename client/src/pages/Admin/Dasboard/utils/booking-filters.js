// Booking filtering utilities
export const filterBookings = (bookings, filters) => {

  try {
    const { statusFilter, searchTerm, dateFrom, dateTo, branchFilter } = filters
    if (!bookings || !Array.isArray(bookings)) {
      console.warn("Invalid bookings data provided to filterBookings")
      return []
    }

    // console.log("Filtering bookings:", {
    //   totalBookings: bookings.length,
    //   statusFilter,
    //   searchTerm,
    //   dateFrom: dateFrom?.toISOString(),
    //   dateTo: dateTo?.toISOString(),
    // })

    const filtered = bookings.filter((booking) => {
      try {
        // Check if booking has required structure
        if (!booking || !booking.status) {
          console.warn("Invalid booking structure:", booking)
          return false
        }

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter

        const customerName = booking.customerId?.name || ""
        const customerEmail = booking.customerId?.email || ""
        const matchesSearch =
          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

        // filter by branchId
        const branchId = branchFilter == 'all' || booking.branchId._id == branchFilter
        // Fix date filtering logic
        const bookingDate = new Date(booking.createdAt)
        const matchesDateFrom = !dateFrom || bookingDate >= dateFrom
        const matchesDateTo = !dateTo || bookingDate <= dateTo

        const passes = matchesStatus && matchesSearch && matchesDateFrom && matchesDateTo && branchId
        return passes
      } catch (error) {
        console.error("Error filtering individual booking:", error, booking)
        return false
      }
    })

    // console.log("Filtered results:", filtered.length)
    return filtered
  } catch (error) {
    console.error("Error in filterBookings:", error)
    return []
  }
}

export const paginateBookings = (bookings, currentPage, itemsPerPage) => {
  try {
    // console.log("Paginating bookings:", { currentPage, itemsPerPage });

    if (!bookings || !Array.isArray(bookings)) {
      return {
        paginatedBookings: [],
        totalPages: 0,
        startIndex: 0,
      }
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    return {
      paginatedBookings: bookings.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(bookings.length / itemsPerPage),
      startIndex,
    }
  } catch (error) {
    console.error("Error in paginateBookings:", error)
    return {
      paginatedBookings: [],
      totalPages: 0,
      startIndex: 0,
    }
  }
}
