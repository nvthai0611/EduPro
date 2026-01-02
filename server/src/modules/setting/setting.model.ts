import mongoose, { Types, Document } from "mongoose";
import { bannerSchema, IBanner } from "../banner/banner.model";

export interface ISetting extends Document {
    _id: Types.ObjectId;
    key: string;
    name: string;
    description?: string;
    category: 'general' | 'homepage' | 'appearance' | 'system' | 'email' | 'payment' | 'security' | 'other';
    enabled: boolean;
    value?: any;
    metadata?: Map<string, any>;
    banners: Types.DocumentArray<IBanner>;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        enum: ['general', 'homepage', 'appearance', 'system', 'email', 'payment', 'security', 'other'],
        default: 'general',
        index: true
    },
    enabled: {
        type: Boolean,
        default: true,
        index: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    },
    banners: {
        type: [bannerSchema],
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    collection: 'Settings',
    timestamps: true
});

// Index for common queries
settingSchema.index({ key: 1, isDeleted: 1 });
settingSchema.index({ category: 1, enabled: 1, isDeleted: 1 });

const Setting = mongoose.model<ISetting>('Setting', settingSchema);

export default Setting;