import mongoose, { Types } from "mongoose";
import { bannerSchema, IBanner } from "../banner/banner.model";


export interface ISetting extends Document {
    banners: Types.DocumentArray<IBanner>;
}

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    banners:{
        type: [bannerSchema],
        default: []
    }
}, {
    collection: 'Settings',
    timestamps: true
});
settingSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingSettings = await Setting.find({});
        if (existingSettings.length > 0) {
            throw new Error("Chỉ được phép có một tài liệu Setting duy nhất.");
        }
    }
    next();
});
const Setting = mongoose.model<ISetting>('Setting', settingSchema);

export default Setting;