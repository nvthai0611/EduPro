import { Review } from "./review.model";
import mongoose from "mongoose";

export class ReviewRepository {
    static getByCourse(courseId: string) {
        return Review.find({
            courseId: new mongoose.Types.ObjectId(courseId),
        })
            .populate("userId", "fullName image")
            .sort({ createdAt: -1 })
            .lean();
    }

    static create(data: {
        courseId: string;
        userId: string;
        rating: number;
        comment: string;
    }) {
        return Review.create(data);
    }

    static async getStats(courseId: string) {
        const result = await Review.aggregate([
            {
                $match: {
                    courseId: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: "$courseId",
                    avgRating: { $avg: "$rating" },
                    total: { $sum: 1 },
                },
            },
        ]);

        return result[0] || { avgRating: 0, total: 0 };
    }

    static deleteById(reviewId: string) {
        return Review.findByIdAndDelete(
            new mongoose.Types.ObjectId(reviewId)
        );
    }

    static deleteByIdAndUser(reviewId: string, userId: string) {
        return Review.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(reviewId),
            userId: new mongoose.Types.ObjectId(userId),
        });
    }

    static updateById(reviewId: string, data: any) {
        return Review.findByIdAndUpdate(
            new mongoose.Types.ObjectId(reviewId),
            { $set: data },
            { new: true }
        );
    }

    static updateByIdAndUser(
        reviewId: string,
        userId: string,
        data: any
    ) {
        return Review.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(reviewId),
                userId: new mongoose.Types.ObjectId(userId),
            },
            { $set: data },
            { new: true }
        );
    }
}