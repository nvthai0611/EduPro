// Fake data generator
export const generateFakeData = () => {
  const users = [
    { _id: "1", fullName: "Nguyễn Văn An", email: "an@example.com", phoneNumber: "0901234567" },
    { _id: "2", fullName: "Trần Thị Bình", email: "binh@example.com", phoneNumber: "0912345678" },
    { _id: "3", fullName: "Lê Văn Cường", email: "cuong@example.com", phoneNumber: "0923456789" },
    { _id: "4", fullName: "Phạm Thị Dung", email: "dung@example.com", phoneNumber: "0934567890" },
    { _id: "5", fullName: "Hoàng Văn Em", email: "em@example.com", phoneNumber: "0945678901" },
  ]

  const products = [
    { _id: "1", name: "iPhone 15 Pro", price: 25000000 },
    { _id: "2", name: "Samsung Galaxy S24", price: 20000000 },
    { _id: "3", name: "MacBook Air M2", price: 30000000 },
    { _id: "4", name: "iPad Pro", price: 22000000 },
    { _id: "5", name: "AirPods Pro", price: 5000000 },
  ]

  const orders = []
  const statuses = ["pending", "paid", "completed", "cancelled"]
  const shippingStatuses = ["pending", "shipped", "delivered"]
  const deliveryTimes = ["standard", "allday", "fastdelivery"]

  for (let i = 1; i <= 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const numItems = Math.floor(Math.random() * 3) + 1
    const items = []
    let totalAmount = 0

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const price = product.price
      items.push({
        product: product,
        quantity: quantity,
        price: price,
      })
      totalAmount += price * quantity
    }

    const shippingFee = Math.floor(Math.random() * 50000) + 20000
    totalAmount += shippingFee

    const createdAt = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    orders.push({
      _id: i.toString(),
      orderCode: 1000 + i,
      UserId: user,
      items: items,
      totalAmount: totalAmount,
      shippingFee: shippingFee,
      shippingAddress: `${Math.floor(Math.random() * 999) + 1} Đường ABC, Quận ${Math.floor(Math.random() * 12) + 1}, TP.HCM`,
      note: Math.random() > 0.7 ? "Giao hàng nhanh" : "",
      deliveryTime: deliveryTimes[Math.floor(Math.random() * deliveryTimes.length)],
      statusOrder: statuses[Math.floor(Math.random() * statuses.length)],
      statusShipping: shippingStatuses[Math.floor(Math.random() * shippingStatuses.length)],
      createdAt: createdAt,
      updatedAt: createdAt,
    })
  }

  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
