export const calculateTotalRevenue = (bookings) => {
  return bookings
    .filter(booking => booking.status === 'completed')
    .reduce((total, booking) => {
      const price = booking.totalPay || 0
      return total + price
    }, 0)
}

export const calculatePendingRevenue = (bookings) => {
  return bookings
    .filter(booking => ['confirmed'].includes(booking.status))
    .reduce((total, booking) => {
      const price = booking.totalPay || 0
      return total + price
    }, 0)
}

export const calculateCompletedBookings = (bookings) => {
  return bookings.filter(booking => booking.status === 'completed').length
}

export const calculateCompletionRate = (bookings) => {
  if (bookings.length === 0) return 0
  const completed = calculateCompletedBookings(bookings)
  return (completed / bookings.length) * 100
} 