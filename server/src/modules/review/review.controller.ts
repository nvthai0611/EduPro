import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { encryptData } from "../../utils/encryption";

export class ReviewController {
    static async create(req: Request, res: Response) {
        try {
            const user = req.user as any;

            const review = await ReviewService.createReview({
                courseId: req.body.courseId,
                userId: user.id,
                rating: req.body.rating,
                comment: req.body.comment,
            });

            res.status(201).json(review);
        } catch (err: any) {
            if (err.code === 11000) {
                return res.status(400).json({
                    message: "Bạn đã đánh giá khóa học này rồi",
                });
            }
            res.status(500).json({ message: err.message });
        }
    }

    static async getByCourse(req: Request, res: Response) {
        const data = await ReviewService.getReviews(req.params.courseId);
        res.json(data);
    }

    static async getByCourseSlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;

            const data = await ReviewService.getReviewsByCourseSlug(slug);

            res.setHeader("x-encrypted", "true");
            return res
                .status(200)
                .json({ success: true, encryptedData: encryptData(data) });
        } catch (err: any) {
            res.status(500).json({
                message: err.message,
            });
        }
    }


    static async delete(req: Request, res: Response) {
        try {
            const user = req.user as any;

            await ReviewService.deleteReview({
                reviewId: req.params.reviewId,
                userId: user.id,
                role: user.role, // "admin" | "user"
            });

            res.json({
                success: true,
                message: "Xóa review thành công",
            });
        } catch (err: any) {
            res.status(403).json({
                message: err.message,
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const { rating, comment } = req.body;

            const review = await ReviewService.updateReview({
                reviewId: req.params.reviewId,
                userId: user.id,
                role: user.role,
                rating,
                comment,
            });

            res.json({
                message: "Cập nhật review thành công",
                data: review,
            });
        } catch (err: any) {
            res.status(403).json({
                message: err.message,
            });
        }
    }
}
