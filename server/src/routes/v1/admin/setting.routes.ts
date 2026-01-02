import settingController from '../../../modules/setting/setting.controller';
import authenticateToken from '../../../middlewares/auth/authenticateToken';
import { authorizeRoles } from '../../../middlewares/auth/authorizeRoles';
import { Router } from 'express';

const router: Router = Router();

router.get('/health', (req, res) => {
    res.send('Setting Admin API is working');
});

/**
 * ==================== SETTING CRUD ROUTES ====================
 */

// Get all settings (with optional filters: category, enabled)
router.get('/', authenticateToken, authorizeRoles(['admin']), settingController.getAllSettings);

// Get settings by category
router.get('/category/:category', authenticateToken, authorizeRoles(['admin']), settingController.getSettingsByCategory);

// Get setting by ID (must be before /:key to avoid conflict)
router.get('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.getSettingById);

// Update setting by ID
router.put('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.updateSettingById);

// Delete setting by ID (soft delete)
router.delete('/id/:id', authenticateToken, authorizeRoles(['admin']), settingController.deleteSetting);

// Toggle setting status
router.patch('/id/:id/toggle', authenticateToken, authorizeRoles(['admin']), settingController.toggleSettingStatus);

// Create new setting
router.post('/', authenticateToken, authorizeRoles(['admin']), settingController.createSetting);

/**
 * ==================== BANNER ROUTES (scoped by key) ====================
 * IMPORTANT: These must come BEFORE the generic /:key routes to avoid conflicts
 */

// Add banner to setting
router.post('/:key/slides', authenticateToken, authorizeRoles(['admin']), settingController.addBanner);

// Get all banners for admin (including inactive)
router.get('/:key/slides', authenticateToken, authorizeRoles(['admin']), settingController.getAdminBanners);

// Update banner
router.put('/:key/slides/:id', authenticateToken, authorizeRoles(['admin']), settingController.updateBanner);

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
