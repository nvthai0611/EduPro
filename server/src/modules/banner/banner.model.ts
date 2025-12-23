import mongoose from "mongoose";


export interface IBanner extends Document {
    title: string;
    imageUrl: string;
    linkUrl: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'Banners',
    timestamps: true
});

const Banner = mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;