import mongoose from 'mongoose';
import { INotification, NotificationType } from './notification.model';
import notificationRepository from './notification.repository';

export interface CreateNotificationDTO {
  recipientId: mongoose.Types.ObjectId | string;
  actorId: mongoose.Types.ObjectId | string;
  type: NotificationType;
  postId?: mongoose.Types.ObjectId | string;
  commentId?: mongoose.Types.ObjectId | string;
  message?: string;
  actorName?: string; // To avoid extra DB lookup
  digestDate?: string; // For DAILY_DIGEST: YYYY-MM-DD format
}

export interface GetNotificationsOptions {
  unreadOnly?: boolean;
  limit?: number;
  skip?: number;
}


export interface GetNotificationsResult {
  items: INotification[];
  unreadCount: number;
  total: number;
}


class NotificationService {

  async createNotification(
    dto: CreateNotificationDTO
  ): Promise<INotification | null> {
    const recipientId = this.toObjectId(dto.recipientId);
    const actorId = this.toObjectId(dto.actorId);

    if (recipientId.equals(actorId)) {
      return null;
    }

   
    if (dto.type === NotificationType.DAILY_DIGEST) {
      const digestDate = dto.digestDate || this.getTodayDateString();
      
      const existingDigest = await notificationRepository.findOne({
        recipientId,
        type: NotificationType.DAILY_DIGEST,
        digestDate,
      });

      if (existingDigest) {
        return existingDigest; // Already sent today
      }

      // Create digest notification
      const notification = await notificationRepository.create({
        recipientId,
        actorId,
        type: dto.type,
        message: dto.message || 'Bạn có thông báo chưa đọc',
        isRead: false,
        digestDate,
      });

      return notification;
    }
    // check spam noti
    const duplicate = await this.checkDuplicateNotification(
      recipientId,
      dto.type,
      dto.postId,
      dto.commentId
    );

    if (duplicate) {
      return duplicate; // Return existing instead of creating new
    }

    // Generate human-readable message
    const message = dto.message || this.generateMessage(dto);

    // Create notification via repository
    const notification = await notificationRepository.create({
      recipientId,
      actorId,
      type: dto.type,
      postId: dto.postId ? this.toObjectId(dto.postId) : undefined,
      commentId: dto.commentId ? this.toObjectId(dto.commentId) : undefined,
      message,
      isRead: false,
    });

    return notification;
  }

  /**
   * Check for duplicate notification within 1-hour window
   * 
   * Grouping strategy:
   * - POST_COMMENT: Group by postId (all comments on same post)
   * - COMMENT_REPLY: Group by commentId (all replies to same comment)
   * 
   * @param recipientId - Recipient user ID
   * @param type - Notification type
   * @param postId - Optional post ID for grouping
   * @param commentId - Optional comment ID for grouping
   * @returns Existing notification or null
   */
  private async checkDuplicateNotification(
    recipientId: mongoose.Types.ObjectId,
    type: NotificationType,
    postId?: mongoose.Types.ObjectId | string,
    commentId?: mongoose.Types.ObjectId | string
  ): Promise<INotification | null> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Decide grouping key based on notification type
    const groupingKey: any = {};
    
    if (type === NotificationType.POST_COMMENT && postId) {
      groupingKey.postId = this.toObjectId(postId);
    }
    
    if (type === NotificationType.COMMENT_REPLY && commentId) {
      groupingKey.commentId = this.toObjectId(commentId);
    }

    return notificationRepository.findDuplicateInWindow(
      recipientId,
      type,
      oneHourAgo,
      groupingKey
    );
  }

  /**
   * Get notifications for a user with pagination
   * 
   * @param userId - User ID to fetch notifications for
   * @param options - Pagination and filter options
   * @returns Notifications with unread count
   */
  async getNotifications(
    userId: mongoose.Types.ObjectId | string,
    options: GetNotificationsOptions = {}
  ): Promise<GetNotificationsResult> {
    const { unreadOnly = false, limit = 20, skip = 0 } = options;
    const userObjectId = this.toObjectId(userId);

    const query: any = { recipientId: userObjectId };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Parallel queries for better performance
    const [items, unreadCount, total] = await Promise.all([
      notificationRepository.find(query, {
        populate: 'actorId',
        sort: { createdAt: -1 },
        skip,
        limit,
        lean: true,
      }),
      
      notificationRepository.count({
        recipientId: userObjectId,
        isRead: false,
      }),

      notificationRepository.count(query),
    ]);

    return {
      items,
      unreadCount,
      total,
    };
  }


  async markAsRead(
    notificationId: mongoose.Types.ObjectId | string,
    userId: mongoose.Types.ObjectId | string
  ): Promise<INotification | null> {
    return notificationRepository.updateOne(
      {
        _id: this.toObjectId(notificationId),
        recipientId: this.toObjectId(userId),
      },
      { isRead: true }
    );
  }

  async markAllAsRead(
    userId: mongoose.Types.ObjectId | string
  ): Promise<{ modifiedCount: number }> {
    return notificationRepository.updateMany(
      {
        recipientId: this.toObjectId(userId),
        isRead: false,
      },
      { isRead: true }
    );
  }


  async getUnreadCount(
    userId: mongoose.Types.ObjectId | string
  ): Promise<number> {
    return notificationRepository.count({
      recipientId: this.toObjectId(userId),
      isRead: false,
    });
  }

  async createDailyDigests(): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = this.getTodayDateString();

    // Aggregate unread notifications per user via repository
    const aggregation = await notificationRepository.aggregateUnreadForDailyDigest(
      yesterday
    );

    // Prepare digest notifications
    const digests = [];
    
    for (const item of aggregation) {
      const recipientId = item._id;

      // Business rule: Only 1 digest per user per day
      const existingDigest = await notificationRepository.findOne({
        recipientId,
        type: NotificationType.DAILY_DIGEST,
        digestDate: today,
      });

      if (!existingDigest) {
        digests.push({
          recipientId,
          actorId: recipientId, // System notification (no real actor)
          type: NotificationType.DAILY_DIGEST,
          message: `Bạn có ${item.count} thông báo chưa đọc`,
          isRead: false,
          digestDate: today,
        });
      }
    }

    // Bulk insert for performance
    if (digests.length > 0) {
      await notificationRepository.insertMany(digests);
    }

    return digests.length;
  }


  async deleteOldNotifications(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await notificationRepository.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });

    return result.deletedCount;
  }


  private generateMessage(dto: CreateNotificationDTO): string {
    const actorName = dto.actorName || 'Ai đó';

    switch (dto.type) {
      case NotificationType.POST_COMMENT:
        return `${actorName} đã bình luận bài viết của bạn`;
      
      case NotificationType.COMMENT_REPLY:
        return `${actorName} đã trả lời bình luận của bạn`;
      
      case NotificationType.DAILY_DIGEST:
        return 'Bạn có thông báo chưa đọc';
      
      default:
        return 'Bạn có một thông báo mới';
    }
  }


  private toObjectId(id: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId {
    if (typeof id === 'string') {
      return new mongoose.Types.ObjectId(id);
    }
    return id;
  }


  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Export singleton instance
export default new NotificationService();
