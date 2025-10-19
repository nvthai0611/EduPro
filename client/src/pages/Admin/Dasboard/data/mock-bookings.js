// Mock data for demonstration
export const mockBookings = [
  {
    _id: "1",
    customerId: { name: "John Doe", email: "john@example.com" },
    branchId: { name: "Downtown Branch" },
    staffId: [{ name: "Alice Smith" }],
    serviceId: [{ name: "Hair Cut", basePrice: 50 }],
    startTime: "14:30",
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 60,
    totalPrice: 50,
    totalPaid: 50,
    status: "completed",
    notes: "Regular customer",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "2",
    customerId: { name: "Jane Wilson", email: "jane@example.com" },
    branchId: { name: "Mall Branch" },
    staffId: [{ name: "Bob Johnson" }],
    serviceId: [{ name: "Hair Color", basePrice: 120 }],
    startTime: "10:00",
    dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    duration: 120,
    totalPrice: 120,
    totalPaid: 60,
    status: "confirmed",
    notes: "First time customer",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "3",
    customerId: { name: "Mike Brown", email: "mike@example.com" },
    branchId: { name: "Downtown Branch" },
    staffId: [{ name: "Carol Davis" }],
    serviceId: [{ name: "Beard Trim", basePrice: 30 }],
    startTime: "16:00",
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    duration: 30,
    totalPrice: 30,
    totalPaid: 0,
    status: "pending",
    notes: "",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "4",
    customerId: { name: "Sarah Lee", email: "sarah@example.com" },
    branchId: { name: "Mall Branch" },
    staffId: [{ name: "David Wilson" }],
    serviceId: [{ name: "Facial Treatment", basePrice: 80 }],
    startTime: "11:30",
    dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    duration: 90,
    totalPrice: 80,
    totalPaid: 80,
    status: "completed",
    notes: "VIP customer",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "5",
    customerId: { name: "Tom Garcia", email: "tom@example.com" },
    branchId: { name: "Downtown Branch" },
    staffId: [{ name: "Emma Taylor" }],
    serviceId: [{ name: "Massage", basePrice: 100 }],
    startTime: "13:00",
    dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    duration: 60,
    totalPrice: 100,
    totalPaid: 50,
    status: "cancelled",
    notes: "Customer cancelled",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
]

// Generate more mock data for pagination demo with recent dates
export const generateMockData = () => {
  const additionalData = []
  const now = Date.now()

  for (let i = 6; i <= 50; i++) {
    // Generate dates within the last 60 days to ensure we have data in the 30-day filter
    const daysAgo = Math.floor(Math.random() * 60) // 0-60 days ago
    const bookingDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000)

    additionalData.push({
      _id: i.toString(),
      customerId: { name: `Customer ${i}`, email: `customer${i}@example.com` },
      branchId: { name: i % 2 === 0 ? "Downtown Branch" : "Mall Branch" },
      staffId: [{ name: `Staff ${i}` }],
      serviceId: [{ name: `Service ${i}`, basePrice: Math.floor(Math.random() * 150) + 30 }],
      startTime: `${Math.floor(Math.random() * 12) + 9}:${Math.random() > 0.5 ? "00" : "30"}`,
      dateTime: bookingDate,
      duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
      totalPrice: Math.floor(Math.random() * 150) + 30,
      totalPaid: Math.floor(Math.random() * 100),
      status: ["pending", "confirmed", "cancelled", "completed"][Math.floor(Math.random() * 4)],
      notes: Math.random() > 0.5 ? "Some notes" : "",
      createdAt: bookingDate,
    })
  }
  return [...mockBookings, ...additionalData]
}

export const allBookings = generateMockData()
