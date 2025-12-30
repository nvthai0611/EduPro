import settingController from '../../../modules/setting/setting.controller';
import authenticateToken from '../../../middlewares/auth/authenticateToken';
import { authorizeRoles } from '../../../middlewares/auth/authorizeRoles';
import { Router } from 'express';

const router: Router = Router();

router.get('/health', (req, res) => {
    res.send('Setting API is working');
});
// Admin routes - Yêu cầu authentication + admin role 
// Create or replace full setting document for a given key
router.post('/:key', authenticateToken, authorizeRoles(['admin']), settingController.createSetting);
// Get full setting (admin) by key
router.get('/:key', authenticateToken, authorizeRoles(['admin']), settingController.getSetting);
// Get all settings
router.get('/', authenticateToken, authorizeRoles(['admin']), settingController.getAllSettings);
// Banners routes scoped by key
router.post('/:key/slides', authenticateToken, authorizeRoles(['admin']), settingController.addBanner);
router.get('/:key/slides', authenticateToken, authorizeRoles(['admin']), settingController.getAdminBanners);
router.put('/:key/slides/:id', authenticateToken, authorizeRoles(['admin']), settingController.updateBanner);
router.delete('/:key/slides/:id', authenticateToken, authorizeRoles(['admin']), settingController.removeBanner);
router.put('/:key/slides/reorder', authenticateToken, authorizeRoles(['admin']), settingController.reorderBanners);
export const settingAdminRoutes: Router = router;
