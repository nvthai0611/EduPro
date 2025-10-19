// lib/fake-data.js

// Helper to generate a fake ObjectId-like string (simple version)
const generateObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)
  return timestamp + "xxxxxxxxxxxxxxxx".replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)).toLowerCase()
}

// Helper to generate a random integer within a range
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper to generate a random boolean
const getRandomBoolean = () => Math.random() < 0.5

// Helper to generate a simple random comment
const getRandomComment = () => {
  const words = [
    "Dịch vụ tuyệt vời!",
    "Rất hài lòng với trải nghiệm.",
    "Nhân viên thân thiện và chuyên nghiệp.",
    "Không gian sạch sẽ và thoải mái.",
    "Chắc chắn sẽ quay lại.",
    "Cần cải thiện thêm.",
    "Khá tốt, nhưng có thể tốt hơn.",
    "Đánh giá cao sự nhiệt tình.",
    "Mọi thứ đều ổn.",
    "Trải nghiệm không được như mong đợi.",
    "Tuyệt vời từ đầu đến cuối.",
    "Rất đáng tiền.",
    "Sẽ giới thiệu cho bạn bè.",
    "Chất lượng dịch vụ cao.",
    "Phản hồi nhanh chóng.",
  ]
  const numWords = getRandomInt(5, 15)
  const comment = []
  for (let i = 0; i < numWords; i++) {
    comment.push(words[getRandomInt(0, words.length - 1)])
  }
  return comment.join(" ") + "."
}

// Helper to get random elements from an array
const getRandomArrayElements = (arr, min, max) => {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  const count = getRandomInt(min, max)
  return shuffled.slice(0, count)
}

export const generateFakeReviews = (count = 30) => {
  const reviews = []
  const possibleOptions = [
    { id: "opt1", label: "Sạch sẽ", category: "Cơ sở vật chất" },
    { id: "opt2", label: "Thân thiện", category: "Dịch vụ" },
    { id: "opt3", label: "Giá trị", category: "Tổng thể" },
    { id: "opt4", label: "Đúng giờ", category: "Dịch vụ" },
    { id: "opt5", label: "Không gian", category: "Cơ sở vật chất" },
    { id: "opt6", label: "Hỗ trợ", category: "Dịch vụ" },
  ]

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - getRandomInt(1, 365) * 24 * 60 * 60 * 1000) // Random date in the past year
    const updatedAt = new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000) // Random date in the past month

    reviews.push({
      _id: generateObjectId(),
      branchId: generateObjectId(),
      userId: generateObjectId(),
      bookingId: getRandomBoolean() ? generateObjectId() : null, // bookingId is optional
      rating: getRandomInt(1, 5),
      comment: getRandomComment(),
      selectedOptions: getRandomArrayElements(possibleOptions, 0, 3),
      status: getRandomBoolean(),
      isFavorite: getRandomBoolean(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })
  }
  return reviews
}

export const generateFakeServiceReviews = (count = 25) => {
  const serviceReviews = []
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - getRandomInt(1, 365) * 24 * 60 * 60 * 1000) // Random date in the past year
    const updatedAt = new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000) // Random date in the past month

    serviceReviews.push({
      _id: generateObjectId(),
      branchId: generateObjectId(),
      userId: generateObjectId(),
      bookingId: generateObjectId(), // bookingId is required for ServiceReview
      serviceId: generateObjectId(),
      rating: getRandomInt(1, 5),
      status: getRandomBoolean(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })
  }
  return serviceReviews
}

export const generateFakeStats = (reviews, serviceReviews) => {
  console.log(reviews);

  const totalReviews = reviews.length
  const totalServiceReviews = serviceReviews.length
  const activeReviews = reviews.filter((r) => r.status).length
  const favoriteReviews = reviews.filter((r) => r.isFavorite).length

  const averageRating =
    totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : "N/A"

  const averageServiceRating =
    totalServiceReviews > 0
      ? (serviceReviews.reduce((sum, r) => sum + r.rating, 0) / totalServiceReviews).toFixed(1)
      : "N/A"

  return {
    totalReviews,
    averageRating,
    activeReviews,
    favoriteReviews,
    totalServiceReviews,
    averageServiceRating,
  }
}
