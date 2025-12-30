import mongoose, { Types } from "mongoose";


export interface IBanner {
    _id: Types.ObjectId;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

export const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    linkUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
   _id: true,
    timestamps: true
});
// // Auto-increment order before saving
// bannerSchema.pre('save', async function(next) {
//     if (this.isNew && (this.order === 0 || this.order === undefined)) {
//         try {
//             const maxOrderBanner = await Banner.findOne({ isDeleted: false })
//                 .sort({ order: -1 })
//                 .select('order')
//                 .lean();
            
//             this.order = maxOrderBanner ? maxOrderBanner.order + 1 : 1;
//         } catch (error) {
//             return next(error as Error);
//         }
//     }
//     next();
// });

// export default Banner;