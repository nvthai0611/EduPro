import express, { Router } from 'express';
import notificationController from '../../modules/notification/notification.controller';

const router = express.Router();


router.get('/', notificationController.getNotifications.bind(notificationController));


router.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));


router.patch('/read-all', notificationController.markAllAsRead.bind(notificationController));


router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));


router.delete('/clear-read', notificationController.clearReadNotifications.bind(notificationController));


router.delete('/:id', notificationController.deleteNotification.bind(notificationController));

router.post('/test', notificationController.createTestNotification.bind(notificationController));

export const notificationRoutes : Router = router;
