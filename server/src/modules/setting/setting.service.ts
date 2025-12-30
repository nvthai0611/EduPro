// import Setting from "./setting.model";

import settingRepository from "./setting.repository";
import Setting from "./setting.model";

class SettingService {
    /**
     * Banner Service
     */
    async addBanner(key: string, payload: any) {
    let setting = await settingRepository.getSettingByKey(key);

    if (!setting) {
      // Create default homepage setting if it doesn't exist
      setting = await settingRepository.createSetting({
        key: key,
        banners: []
      });
    }

    const maxOrder = setting.banners.reduce(
      (max, b) => (b.isDeleted ? max : Math.max(max, b.order)),
      0
    );

    setting.banners.push({
      ...payload,
      order: maxOrder + 1,
    });

    await setting.save();
    console.log('Added banner to key:', key, 'banners:', setting.banners);
    return setting.banners;
  }
  // Get Banners public
  async getBanners(key: string) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      // Create default homepage setting if it doesn't exist
      setting = await settingRepository.createSetting({
        key: key,
        banners: []
      });
    }
    return setting.banners.filter((b) => b.isActive && !b.isDeleted).sort((a, b) => a.order - b.order);
  }
  // Get Banners 
  async getAdminBanners(key: string) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      // Create default homepage setting if it doesn't exist
      setting = await settingRepository.createSetting({
        key: key,
        banners: []
      });
    }
    return setting.banners.filter((b) => !b.isDeleted).sort((a, b) => a.order - b.order);
  }
  async removeBanner(key: string, bannerId: string) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      throw new Error(`Setting ${key} not found`);
    }
    const banner = setting.banners.id(bannerId);
    if (!banner) {
      throw new Error("Banner not found");
    }
    banner.isDeleted = true;
    await setting.save();
    return setting.banners;
  }
  // Update Banner
  async updateBanner(key: string, bannerId: string, data: Partial<any>) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      throw new Error(`Setting ${key} not found`);
    }
    const banner = setting.banners.id(bannerId);
    if (!banner) {
      throw new Error("Banner not found");
    }
    Object.assign(banner, data);
    await setting.save();
    return setting.banners;
  }

  // Get Setting by key
  async getSetting(key: string = "homepage") {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      // Create default homepage setting if it doesn't exist
      setting = await settingRepository.createSetting({
        key: key,
        banners: []
      });
    }
    return setting;
  }

  // Reorder banners
  async reorderBanners(key: string, bannerOrders: { id: string; order: number }[]) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      throw new Error(`Setting ${key} not found`);
    }

    // Update order for each banner
    bannerOrders.forEach(({ id, order }) => {
      const banner = setting.banners.id(id);
      if (banner) {
        banner.order = order;
      }
    });

    await setting.save();
    return setting.banners.filter((b) => !b.isDeleted).sort((a, b) => a.order - b.order);
  }

  // Create full setting (admin)
  async createSetting(key: string, payload: any) {
    // If a setting with the same key exists, update it instead
    const existing = await settingRepository.getSettingByKey(key);
    if (existing) {
      return await settingRepository.updateSetting(existing._id.toString(), payload);
    }
    return await settingRepository.createSetting({ ...payload, key });
  }

  // Get full setting by key
  async getSetting(key: string) {
    let setting = await settingRepository.getSettingByKey(key);
    if (!setting) {
      // Create default setting if it doesn't exist
      setting = await settingRepository.createSetting({
        key: key,
        banners: []
      });
    }
    return setting;
  }

  // Get all settings
  async getAllSettings() {
    return await Setting.find({});
  }

}
export default new SettingService();