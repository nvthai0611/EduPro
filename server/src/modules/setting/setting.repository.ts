import Setting, { ISetting } from "./setting.model";

class SettingRepository {
    // Get all settings (không bị xóa)
    async getAllSettings(filter: any = {}) {
        // Include old documents that don't have isDeleted field
        const query = {
            ...filter,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        };
        return Setting.find(query).sort({ category: 1, key: 1 });
    }

    // Get setting by key
    async getSettingByKey(key: string) {
        // Query without isDeleted filter to handle old documents that don't have this field
        // We'll filter deleted settings at the service layer if needed
        return Setting.findOne({ key, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    }

    // Get setting by ID
    async getSettingById(id: string) {
        return Setting.findOne({ 
            _id: id, 
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] 
        });
    }

    // Create new setting
    async createSetting(data: Partial<ISetting>) {
        return Setting.create(data);
    }

    // Update setting
    async updateSetting(id: string, data: Partial<ISetting>) {
        return Setting.findByIdAndUpdate(
            id, 
            { ...data, updatedAt: new Date() }, 
            { new: true, runValidators: true }
        );
    }

    // Update setting by key
    async updateSettingByKey(key: string, data: Partial<ISetting>) {
        return Setting.findOneAndUpdate(
            { key, isDeleted: false },
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    // Soft delete setting
    async deleteSetting(id: string) {
        return Setting.findByIdAndUpdate(
            id,
            { isDeleted: true, enabled: false },
            { new: true }
        );
    }

    // Hard delete setting (use with caution)
    async permanentlyDeleteSetting(id: string) {
        return Setting.findByIdAndDelete(id);
    }

    // Get settings by category
    async getSettingsByCategory(category: string) {
        return Setting.find({ 
            category, 
            enabled: true,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        }).sort({ key: 1 });
    }

    // Check if key exists
    async keyExists(key: string, excludeId?: string) {
        const query: any = { 
            key,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const setting = await Setting.findOne(query);
        return !!setting;
    }

    // Get banner by ID from a setting
    async getBannerById(bannerId: string) {
        const setting = await Setting.findOne({ 
            'banners._id': bannerId,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        });
        if (!setting) {
            throw new Error("Setting with this banner not found");
        }
        const banner = setting.banners?.id(bannerId);
        return banner;
    }

    // Save setting (for subdocument updates)
    async saveSetting(setting: any) {
        return setting.save();
    }

    // Bulk update settings
    async bulkUpdateSettings(updates: Array<{ id: string; data: Partial<ISetting> }>) {
        const promises = updates.map(({ id, data }) => this.updateSetting(id, data));
        return Promise.all(promises);
    }

    // Get enabled settings
    async getEnabledSettings() {
        return Setting.find({ 
            enabled: true, 
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        }).sort({ category: 1, key: 1 });
    }
}

export default new SettingRepository();