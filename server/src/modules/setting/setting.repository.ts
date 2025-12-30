import Setting from "./setting.model";



class SettingRepository {
    // Repository methods here
    async getSettingByKey(key: string) {
        return Setting.findOne({ key });
    }
    async createSetting(data: Partial<any>) {
        return Setting.create(data);
    }
    async updateSetting(id: string, data: Partial<any>) {
        return Setting.findByIdAndUpdate(id, data, { new: true });
    }
    // get banner id
    async getBannerById(bannerId: string) {
        const setting = await Setting.findOne({ key: "homepage" });
        if (!setting) {
            throw new Error("Setting homepage not found");
        }
        const banner = setting.banners?.id(bannerId);
        if (banner) {
            console.log(banner._id.toString());
        }
        return banner;
    }
    async saveSetting(setting: any) {
        return setting.save();
    }
}

export default new SettingRepository();