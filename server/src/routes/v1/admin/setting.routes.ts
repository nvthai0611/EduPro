import settingController from '../../../modules/setting/setting.controller';
import authenticateToken from '../../../middlewares/auth/authenticateToken';
import { authorizeRoles } from '../../../middlewares/auth/authorizeRoles';
import { uploadSingle } from '../../../middlewares/servers/uploadCloudinary';
import { Router, Request } from 'express';

const router: Router = Router();

router.get('/health', (req, res) => {
    res.send('Setting Admin API is working');
});

router.post('/test-upload', uploadSingle, (req: Request & { file?: Express.Multer.File }, res) => {
    console.log('[TEST-UPLOAD] Reached controller');
    console.log('[TEST-UPLOAD] req.file:', req.file);
    res.json({ 
        success: true, 
        file: req.file,
        message: 'Upload test complete' 
    });
});

router.get('/', authenticateToken, authorizeRoles(['admin']), settingController.getAllSettings);

router.get('/category/:category', authenticateToken, authorizeRoles(['admin']), settingController.getSettingsByCategory);

router.get('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.getSettingById);

router.put('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.updateSettingById);

router.delete('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.deleteSetting);

router.patch('/id/:id/toggle', authenticateToken, authorizeRoles(['admin']), settingController.toggleSettingStatus);

router.post('/', authenticateToken, authorizeRoles(['admin']), settingController.createSetting);

// Upload banner image
router.post('/upload/banner-image', uploadSingle, authenticateToken, authorizeRoles(['admin']), settingController.uploadBannerImage);

router.post('/:key/slides', uploadSingle, authenticateToken, authorizeRoles(['admin']), settingController.addBanner);

router.get('/:key/slides', authenticateToken, authorizeRoles(['admin']), settingController.getAdminBanners);

// Update banner
router.put('/:key/slides/:id', uploadSingle, authenticateToken, authorizeRoles(['admin']), settingController.updateBanner);

// Delete banner (soft delete)
router.delete('/:key/slides/:id', authenticateToken, authorizeRoles(['admin']), settingController.removeBanner);

// Reorder banners
router.put('/:key/banners/reorder', authenticateToken, authorizeRoles(['admin']), settingController.reorderBanners);

/**
 * ==================== GENERIC KEY ROUTES ====================
 * These must come LAST to avoid conflicts with specific routes above
 */

// Get setting by key
router.get('/:key', authenticateToken, authorizeRoles(['admin']), settingController.getSetting);

// Update setting by key
router.put('/:key', authenticateToken, authorizeRoles(['admin']), settingController.updateSettingByKey);

export const settingAdminRoutes: Router = router;
