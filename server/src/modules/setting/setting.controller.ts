import { Request, Response } from "express";
import settingService from "./setting.service";

class SettingController {
    /**
     * ==================== SETTING CRUD CONTROLLERS ====================
     */

    // Get all settings
    async getAllSettings(req: Request, res: Response) {
        try {
            const { category, enabled } = req.query;
            const filter: any = {};
            
            if (category) filter.category = category;
            if (enabled !== undefined) filter.enabled = enabled === 'true';

            const settings = await settingService.getAllSettings(filter);
            res.status(200).json({ success: true, data: settings });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get setting by key
    async getSetting(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const setting = await settingService.getSetting(key);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get setting by ID
    async getSettingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const setting = await settingService.getSettingById(id);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    // Create new setting
    async createSetting(req: Request, res: Response) {
        try {
            const payload = req.body;
            const setting = await settingService.createSetting(payload);
            res.status(201).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Update setting by ID
    async updateSettingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const payload = req.body;
            const setting = await settingService.updateSetting(id, payload);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Update setting by key
    async updateSettingByKey(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const payload = req.body;
            const setting = await settingService.updateSettingByKey(key, payload);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Delete setting
    async deleteSetting(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const setting = await settingService.deleteSetting(id);
            res.status(200).json({ success: true, data: setting, message: 'Setting deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    // Get settings by category
    async getSettingsByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            const settings = await settingService.getSettingsByCategory(category);
            res.status(200).json({ success: true, data: settings });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Toggle setting status
    async toggleSettingStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const setting = await settingService.toggleSettingStatus(id);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    /**
     * ==================== BANNER CONTROLLERS ====================
     */

    // Add banner to setting
    async addBanner(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const payload = req.body;
            const banners = await settingService.addBanner(key, payload);
            res.status(201).json({ success: true, data: banners });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get public banners
    async getBanners(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const banners = await settingService.getBanners(key);
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get all banners (admin)
    async getAdminBanners(req: Request, res: Response) {
        try {
            const { key } = req.params;
            console.log('[Controller] getAdminBanners - key:', key);
            const banners = await settingService.getAdminBanners(key);
            console.log('[Controller] getAdminBanners - banners count:', banners?.length);
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            console.error('[Controller] getAdminBanners - Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Remove banner
    async removeBanner(req: Request, res: Response) {
        try {
            const { key, id } = req.params;
            const banners = await settingService.removeBanner(key, id);
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Update banner
    async updateBanner(req: Request, res: Response) {
        try {
            const { key, id } = req.params;
            const data = req.body;
            console.log('[Controller] updateBanner - key:', key, 'id:', id, 'data:', data);
            const banners = await settingService.updateBanner(key, id, data);
            console.log('[Controller] updateBanner - success');
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            console.error('[Controller] updateBanner - Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Reorder banners
    async reorderBanners(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const bannerOrders = req.body;
            const banners = await settingService.reorderBanners(key, bannerOrders);
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new SettingController();