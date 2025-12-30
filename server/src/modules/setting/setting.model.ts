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
const Setting = mongoose.model<ISetting>('Setting', settingSchema);

export default Setting;