import { Request, Response } from "express";
import settingService from "./setting.service";


class SettingController {
    // Controller methods would go here
    async addBanner(req : Request, res: Response) {
        try {
            const key = req.params.key;
            const payload = req.body;
        console.log('ADD BANNER PAYLOAD:', payload);
            const banners = await settingService.addBanner(key, payload);
            res.status(201).json(banners);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createSetting(req: any, res: any) {
        try {
            const key = req.params.key;
            const payload = req.body;
            const setting = await settingService.createSetting(key, payload);
            res.status(201).json(setting);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAdminBanners(req: any, res: any) {
        try {
            const key = req.params.key;
            // const settingService = new SettingService();
            const banners = await settingService.getAdminBanners(key);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getBanners(req: any, res: any) {
        try {
            const key = req.params.key;
            const banners = await settingService.getBanners(key);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSetting(req: any, res: any) {
        try {
            const key = req.params.key;
            // const settingService = new SettingService();
            const banners = await settingService.getSetting(key);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async removeBanner(req: any, res: any) {
        try {
            const key = req.params.key;
            const bannerId = req.params.id;
            // const settingService = new SettingService();
            const banners = await settingService.removeBanner(key, bannerId);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateBanner(req: any, res: any) {
        try {
            const key = req.params.key;
            const bannerId = req.params.id;
            const data = req.body;
            // const settingService = new SettingService();
            const banners = await settingService.updateBanner(key, bannerId, data);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async reorderBanners(req: any, res: any) {
        try {
            const key = req.params.key;
            const bannerOrders = req.body;
            const banners = await settingService.reorderBanners(key, bannerOrders);
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default new SettingController();