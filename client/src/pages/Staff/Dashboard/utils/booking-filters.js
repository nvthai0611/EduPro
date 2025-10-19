export const filterBookings = (bookings, filters) => {
  if (!bookings || !Array.isArray(bookings)) {
    return []
  }

  return bookings.filter(booking => {
    // Status filter
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      if (booking.status !== filters.statusFilter) {
        return false
      }
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const customerName = booking.customerId?.fullName?.toLowerCase() || ''
      const customerEmail = booking.customerId?.email?.toLowerCase() || ''
      const serviceName = booking.serviceId?.name?.toLowerCase() || ''
      
      if (!customerName.includes(searchLower) && 
          !customerEmail.includes(searchLower) && 
          !serviceName.includes(searchLower)) {
        return false
      }
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const bookingDate = new Date(booking.dateTime)
      
      if (filters.dateFrom && bookingDate < filters.dateFrom) {
        return false
      }
      
      if (filters.dateTo && bookingDate > filters.dateTo) {
        return false
      }
    }

    return true
  })
}

export const paginateBookings = (bookings, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBookings = bookings.slice(startIndex, endIndex)
  const totalPages = Math.ceil(bookings.length / itemsPerPage)

  return {
    paginatedBookings,
    totalPages,
    startIndex
  }
} 