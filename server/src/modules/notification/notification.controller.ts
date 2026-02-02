import { Request, Response } from 'express';
import mongoose from 'mongoose';
import notificationService from './notification.service';

class NotificationController {

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Parse and validate query params
      const unreadOnly = req.query.unread === 'true';
      const limit = Math.min(
        parseInt(req.query.limit as string) || 20,
        100 // Max limit to prevent abuse
      );
      const skip = parseInt(req.query.skip as string) || 0;

      // Call service layer
      const result = await notificationService.getNotifications(userId, {
        unreadOnly,
        limit,
        skip,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[NotificationController] getNotifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }


  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      console.error('[NotificationController] getUnreadCount error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const notificationId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid notification ID',
        });
        return;
      }

      const notification = await notificationService.markAsRead(
        notificationId,
        userId
      );

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error: any) {
      console.error('[NotificationController] markAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const result = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} notifications marked as read`,
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error: any) {
      console.error('[NotificationController] markAllAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  async createTestNotification(req: Request, res: Response): Promise<void> {
    try {
      // Only allow in development
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          message: 'Test endpoint not available in production',
        });
        return;
      }

      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { type, recipientId, message } = req.body;

      // Use current user as actor, and recipientId from body or self
      const targetRecipientId = recipientId || userId;

      const notification = await notificationService.createNotification({
        recipientId: targetRecipientId,
        actorId: userId,
        type: type || 'POST_COMMENT',
        message: message || 'Test notification',
        actorName: req.user?.fullName || 'Test User',
      });

      res.status(201).json({
        success: true,
        message: 'Test notification created',
        data: notification,
      });
    } catch (error: any) {
      console.error('[NotificationController] createTestNotification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create test notification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

// Export singleton instance
export default new NotificationController();
