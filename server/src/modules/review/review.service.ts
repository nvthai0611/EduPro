import Course from "../course/course.model";
import { ReviewRepository } from "./review.repository";

export class ReviewService {
    static async createReview(payload: {
        courseId: string;
        userId: string;
        rating: number;
        comment: string;
    }) {
        return ReviewRepository.create(payload);
    }

    static async getReviews(courseId: string) {
        const reviews = await ReviewRepository.getByCourse(courseId);
        const stats = await ReviewRepository.getStats(courseId);

        return {
            reviews: reviews.map((r: any) => ({
                id: r._id,
                userName: r.userId.name,     // luôn mới
                avatar: r.userId.avatar,     // luôn mới
                rating: r.rating,
                comment: r.comment,
                date: new Date(r.createdAt).toLocaleDateString("vi-VN"),
            })),
            averageRating: Number(stats.avgRating.toFixed(1)),
            totalReviews: stats.total,
        };
    }

    static async getReviewsByCourseSlug(slug: string) {
        const course = await Course.findOne({ slug }).select("_id").lean();

        if (!course) {
            throw new Error("Không tìm thấy khóa học");
        }

        return ReviewRepository.getByCourse(course._id.toString());
    }

    static async deleteReview(payload: {
        reviewId: string;
        userId: string;
        role?: string;
    }) {
        const { reviewId, userId, role } = payload;

        let deleted: any;

        // Admin xoá tất cả
        if (role === "admin") {
            deleted = await ReviewRepository.deleteById(reviewId);
        } else {
            // User thường chỉ xoá review của mình
            deleted = await ReviewRepository.deleteByIdAndUser(reviewId, userId);
        }

        if (!deleted) {
            throw new Error("Không có quyền xoá hoặc review không tồn tại");
        }

        return deleted;
    }

    // review.service.ts
    static async updateReview(payload: {
        reviewId: string;
        userId: string;
        role?: string;
        rating?: number;
        comment?: string;
    }) {
        const { reviewId, userId, role, rating, comment } = payload;

        if (rating && (rating < 1 || rating > 5)) {
            throw new Error("Rating phải từ 1 đến 5");
        }

        const updateData: any = {};
        if (rating !== undefined) updateData.rating = rating;
        if (comment !== undefined) updateData.comment = comment;

        if (Object.keys(updateData).length === 0) {
            throw new Error("Không có dữ liệu để cập nhật");
        }

        let updated;

        if (role === "admin") {
            updated = await ReviewRepository.updateById(reviewId, updateData);
        } else {
            updated = await ReviewRepository.updateByIdAndUser(
                reviewId,
                userId,
                updateData
            );
        }

        if (!updated) {
            throw new Error("Không có quyền sửa review này");
        }

        return updated;
    }
}
