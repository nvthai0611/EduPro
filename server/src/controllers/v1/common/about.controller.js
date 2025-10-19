const Review = require('../../../models/review.model');

exports.getAverageRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $match: {
          branchId: { $exists: false } 
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result[0]?.averageRating || 0;
    const count = result[0]?.count || 0;
    res.status(200).json({ averageRating, count });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy rating trung bình', error: error.message });
  }
};
