const express = require("express");
const { getAllSettingController, addNewSettingController, updateSettingController, deleteSettingController } = require("../../../../controllers/v1/admin/setting.controller");
const authMiddleware = require("../../../../middlewares/auth/v1/auth.middleware");
const adminMiddleware = require("../../../../middlewares/auth/v1/admin.middleware");
const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllSettingController)
router.post('/', authMiddleware, adminMiddleware, addNewSettingController)
router.put('/:id', authMiddleware, adminMiddleware, updateSettingController)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSettingController)

module.exports = router