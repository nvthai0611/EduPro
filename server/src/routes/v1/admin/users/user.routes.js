const express = require('express');
const router = express.Router();
const { getAllUsersByCondition, getDetailUser, updateUser, getAllRole, addUser, verifyAccount, getStaffByUserId, deleteUserById } = require('../../../../controllers/v1/admin/user.controller');
const authMiddleware = require('../../../../middlewares/auth/v1/auth.middleware.js');
const adminMiddleware = require('../../../../middlewares/auth/v1/admin.middleware');

router.get('/', authMiddleware, getAllUsersByCondition);
router.get('/:id', authMiddleware, adminMiddleware, getDetailUser);
router.get('/staff/:userId', authMiddleware, adminMiddleware, getStaffByUserId);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);

router.post('/addUser', authMiddleware, adminMiddleware, addUser)
router.put('/verify-account/:id', verifyAccount)

router.get('/role/getAll', authMiddleware, adminMiddleware, getAllRole)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUserById)
module.exports = router;