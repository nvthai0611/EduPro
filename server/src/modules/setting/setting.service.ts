import settingRepository from "./setting.repository";
import Setting, { ISetting } from "./setting.model";
import cloudinary from "../../config/cloundinary";

class SettingService {
    /**
     * ==================== SETTING CRUD OPERATIONS ====================
     */

    // Get all settings
    async getAllSettings(filter?: any) {
        return await settingRepository.getAllSettings(filter);
    }

    // Get setting by key
    async getSetting(key: string) {
        let setting = await settingRepository.getSettingByKey(key);
        if (!setting) {
            // Create default setting if it doesn't exist
            setting = await settingRepository.createSetting({
                key: key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                category: key === 'homepage' ? 'homepage' : 'general',
                enabled: true,
                banners: []
            } as Partial<ISetting>);
        }
        return setting;
    }

    // Get setting by ID
    async getSettingById(id: string) {
        const setting = await settingRepository.getSettingById(id);
        if (!setting) {
            throw new Error('Setting not found');
        }
        return setting;
    }

    // Create new setting
    async createSetting(data: Partial<ISetting>) {
        // Check if key already exists
        const existingKey = await settingRepository.keyExists(data.key!);
        if (existingKey) {
            throw new Error(`Setting with key "${data.key}" already exists`);
        }

        // Set defaults
        const settingData: Partial<ISetting> = {
            ...data,
            name: data.name || data.key!.charAt(0).toUpperCase() + data.key!.slice(1),
            category: data.category || 'general',
            enabled: data.enabled !== undefined ? data.enabled : true,
            isDeleted: false,
            banners: data.banners
        };

        return await settingRepository.createSetting(settingData);
    }

    // Update setting by ID
    async updateSetting(id: string, data: Partial<ISetting>) {
        // Check if setting exists
        const existing = await settingRepository.getSettingById(id);
        if (!existing) {
            throw new Error('Setting not found');
        }

        // If updating key, check for duplicates
        if (data.key && data.key !== existing.key) {
            const keyExists = await settingRepository.keyExists(data.key, id);
            if (keyExists) {
                throw new Error(`Setting with key "${data.key}" already exists`);
            }
        }

        return await settingRepository.updateSetting(id, data);
    }

    // Update setting by key
    async updateSettingByKey(key: string, data: Partial<ISetting>) {
        const existing = await settingRepository.getSettingByKey(key);
        if (!existing) {
            throw new Error(`Setting with key "${key}" not found`);
        }

        return await settingRepository.updateSettingByKey(key, data);
    }

    // Delete setting (soft delete)
    async deleteSetting(id: string) {
        const setting = await settingRepository.getSettingById(id);
        if (!setting) {
            throw new Error('Setting not found');
        }
        return await settingRepository.deleteSetting(id);
    }

    // Get settings by category
    async getSettingsByCategory(category: string) {
        return await settingRepository.getSettingsByCategory(category);
    }

    // Toggle setting enabled status
    async toggleSettingStatus(id: string) {
        const setting = await settingRepository.getSettingById(id);
        if (!setting) {
            throw new Error('Setting not found');
        }
        return await settingRepository.updateSetting(id, { enabled: !setting.enabled } as Partial<ISetting>);
    }

    /**
     * ==================== BANNER OPERATIONS ====================
     */

    // Add banner to setting
    async addBanner(key: string, payload: any) {
        let setting = await settingRepository.getSettingByKey(key);

        if (!setting) {
            // Create default setting if it doesn't exist
            setting = await settingRepository.createSetting({
                key: key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                category: key === 'homepage' ? 'homepage' : 'general',
                enabled: true,
                banners: []
            } as Partial<ISetting>);
        }

        // Ensure setting has required fields for validation (for old documents)
        if (!setting.name) {
            setting.name = key.charAt(0).toUpperCase() + key.slice(1);
        }
        if (!setting.category) {
            setting.category = key === 'homepage' ? 'homepage' : 'general';
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
        return setting.banners.filter((b) => !b.isDeleted).sort((a, b) => a.order - b.order);
    }

    // Get public banners (active only)
    async getBanners(key: string) {
        let setting = await settingRepository.getSettingByKey(key);
        if (!setting) {
            // Create default setting if it doesn't exist
            setting = await settingRepository.createSetting({
                key: key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                category: key === 'homepage' ? 'homepage' : 'general',
                enabled: true,
                banners: []
            } as Partial<ISetting>);
        }
        return setting.banners.filter((b) => b.isActive && !b.isDeleted).sort((a, b) => a.order - b.order);
    }

    // Get all banners (admin - including inactive)
    async getAdminBanners(key: string) {
        try {
            let setting = await settingRepository.getSettingByKey(key);
        
            if (!setting) {
                // Create default setting if it doesn't exist
                setting = await settingRepository.createSetting({
                    key: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    category: key === 'homepage' ? 'homepage' : 'general',
                    enabled: true,
                    banners: []
                } as Partial<ISetting>);
            }
            
            if (!setting.banners || !Array.isArray(setting.banners)) {
                console.log('[Service] getAdminBanners - no banners array, returning empty');
                return [];
            }
            
            const filtered = setting.banners.filter((b) => !b.isDeleted);
            return filtered.sort((a, b) => a.order - b.order);
        } catch (error) {
            throw error;
        }
    }

    // Remove banner (soft delete)
    async removeBanner(key: string, bannerId: string) {
        let setting = await settingRepository.getSettingByKey(key);
        if (!setting) {
            throw new Error(`Setting ${key} not found`);
        }
        
        // Ensure setting has required fields for validation (for old documents)
        if (!setting.name) {
            setting.name = key.charAt(0).toUpperCase() + key.slice(1);
        }
        if (!setting.category) {
            setting.category = key === 'homepage' ? 'homepage' : 'general';
        }
        
        const banner = setting.banners.id(bannerId);
        if (!banner) {
            throw new Error("Banner not found");
        }
        
        // Xóa ảnh trên Cloudinary nếu có publicId
        if (banner.publicId) {
            try {
                await cloudinary.uploader.destroy(banner.publicId);
            } catch (err) {
                                console.error('Error deleting image from Cloudinary:', err);
            }
        }
        
        banner.isDeleted = true;
        await setting.save();
        return setting.banners.filter((b) => !b.isDeleted).sort((a, b) => a.order - b.order);
    }

    // Update banner
    async updateBanner(key: string, bannerId: string, data: Partial<any>) {
        try {
            console.log('[Service] updateBanner - key:', key, 'bannerId:', bannerId);
            console.log('[Service] updateBanner - data received:', JSON.stringify(data));
            
            let setting = await settingRepository.getSettingByKey(key);
            if (!setting) {
                throw new Error(`Setting ${key} not found`);
            }
            console.log('[Service] updateBanner - setting found, banners count:', setting.banners?.length);
            
            // Ensure setting has required fields for validation (for old documents)
            if (!setting.name) {
                setting.name = key.charAt(0).toUpperCase() + key.slice(1);
            }
            if (!setting.category) {
                setting.category = key === 'homepage' ? 'homepage' : 'general';
            }
            
            const banner = setting.banners.id(bannerId);
            if (!banner) {
                throw new Error("Banner not found");
            }
            console.log('[Service] updateBanner - banner before update:', JSON.stringify(banner));
            
            // Update banner fields
            Object.assign(banner, data);
            
            console.log('[Service] updateBanner - banner after update:', JSON.stringify(banner));
            console.log('[Service] updateBanner - Calling setting.save()...');
            
            const savedSetting = await setting.save();
            
            console.log('[Service] updateBanner - Setting saved successfully');
            
            const result = savedSetting.banners.filter((b) => !b.isDeleted).sort((a, b) => a.order - b.order);
            console.log('[Service] updateBanner - success, returning', result.length, 'banners');
            console.log('[Service] updateBanner - Updated banner in result:', JSON.stringify(result.find(b => b._id.toString() === bannerId)));
            
            return result;
        } catch (error) {
            console.error('[Service] updateBanner - Error:', error);
            throw error;
        }
    }
            

    // Reorder banners
    async reorderBanners(key: string, bannerOrders: { id: string; order: number }[]) {
        let setting = await settingRepository.getSettingByKey(key);
        if (!setting) {
            throw new Error(`Setting ${key} not found`);
        }

        // Ensure setting has required fields for validation (for old documents)
        if (!setting.name) {
            setting.name = key.charAt(0).toUpperCase() + key.slice(1);
        }
        if (!setting.category) {
            setting.category = key === 'homepage' ? 'homepage' : 'general';
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
}

export default new SettingService();