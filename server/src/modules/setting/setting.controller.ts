import { Request, Response } from "express";
import settingService from "./setting.service";
import cloudinary from "../../config/cloudinary";
import { encryptData } from "../../utils/encryption";

class SettingController {

    // Upload image to Cloudinary
    async uploadBannerImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }

            // File đã được upload bởi multer-storage-cloudinary
            const imageUrl = (req.file as any).path;
            
            res.status(200).json({ 
                success: true, 
                data: { 
                    imageUrl,
                    publicId: (req.file as any).filename
                } 
            });
        } catch (error: any) {
            console.error('[Controller] uploadBannerImage - Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get all settings
    async getAllSettings(req: Request, res: Response) {
        try {
            const { category, enabled } = req.query;
            const filter: any = {};
            
            if (category) filter.category = category;
            if (enabled !== undefined) filter.enabled = enabled === 'true';

            const settings = await settingService.getAllSettings(filter);
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(settings) });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get setting by key
    async getSetting(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const setting = await settingService.getSetting(key);
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(setting) });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get setting by ID
    async getSettingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const setting = await settingService.getSettingById(id);
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(setting) });
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
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(settings) });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async toggleSettingStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const setting = await settingService.toggleSettingStatus(id);
            res.status(200).json({ success: true, data: setting });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async addBanner(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const payload = req.body;
            
            // Nếu có file upload thì lấy URL từ Cloudinary
            if (req.file) {
                payload.imageUrl = (req.file as any).path;
                payload.publicId = (req.file as any).filename;
            }
            
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
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(banners) });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get all banners (admin)
    async getAdminBanners(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const banners = await settingService.getAdminBanners(key);
            res.setHeader("x-encrypted", "true");
            res.status(200).json({ success: true, encryptedData: encryptData(banners) });
        } catch (error: any) {
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
            
            console.log('[updateBanner] Received data:', { key, id, body: req.body, hasFile: !!req.file });
            
            // Nếu có file upload mới thì cập nhật URL
            if (req.file) {
               
                // Xóa ảnh cũ nếu có publicId
                if (data.oldPublicId) {
                    try {
                        await cloudinary.uploader.destroy(data.oldPublicId);
                    } catch (err) {
                        console.error('[Controller] updateBanner - Error deleting old image:', err);
                    }
                }
                
                data.imageUrl = (req.file as any).path;
                data.publicId = (req.file as any).filename;
            }
            
            // Convert isActive from string to boolean if needed (FormData sends as string)
            if (typeof data.isActive === 'string') {
                data.isActive = data.isActive === 'true';
            }
            
            const banners = await settingService.updateBanner(key, id, data);
            res.status(200).json({ success: true, data: banners });
        } catch (error: any) {
            console.error('[updateBanner] Error:', error);
            
            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err: any) => ({
                    field: err.path,
                    message: err.message
                }));
                return res.status(400).json({ 
                    success: false, 
                    error: 'Dữ liệu không hợp lệ',
                    details: validationErrors
                });
            }
            
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