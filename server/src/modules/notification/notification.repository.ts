import mongoose from 'mongoose';
import Notification, { INotification, NotificationType } from './notification.model';

export interface FindNotificationsQuery {
  recipientId: mongoose.Types.ObjectId;
  isRead?: boolean;
  type?: NotificationType;
  postId?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  digestDate?: string;
  createdAt?: { $gte?: Date; $lt?: Date };
}

export interface FindNotificationsOptions {
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  populate?: string;
  lean?: boolean;
}


export interface DailyDigestAggregateResult {
  _id: mongoose.Types.ObjectId;
  count: number;
}
class NotificationRepository {

  async create(data: Partial<INotification>): Promise<INotification> {
    const notification = await Notification.create(data);
    return notification;
  }

  async findOne(
    query: Partial<FindNotificationsQuery>,
    options: FindNotificationsOptions = {}
  ): Promise<INotification | null> {
    let queryBuilder = Notification.findOne(query);

    if (options.populate) {
      queryBuilder = queryBuilder.populate(options.populate);
    }

    if (options.lean) {
      queryBuilder = queryBuilder.lean();
    }

    return queryBuilder.exec();
  }


  async find(
    query: Partial<FindNotificationsQuery>,
    options: FindNotificationsOptions = {}
  ): Promise<INotification[]> {
    let queryBuilder = Notification.find(query);

    if (options.sort) {
      queryBuilder = queryBuilder.sort(options.sort);
    }

    if (options.skip) {
      queryBuilder = queryBuilder.skip(options.skip);
    }

    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    if (options.populate) {
      queryBuilder = queryBuilder.populate(options.populate);
    }

    if (options.lean) {
      queryBuilder = queryBuilder.lean();
    }

    return queryBuilder.exec() as Promise<INotification[]>;
  }

 
  async count(query: Partial<FindNotificationsQuery>): Promise<number> {
    return Notification.countDocuments(query);
  }

  async updateOne(
    query: Partial<FindNotificationsQuery>,
    update: Partial<INotification>
  ): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    );
  }

 
  async updateMany(
    query: Partial<FindNotificationsQuery>,
    update: Partial<INotification>
  ): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(query, { $set: update });
    return { modifiedCount: result.modifiedCount };
  }

 
  async insertMany(
    notifications: Partial<INotification>[]
  ): Promise<INotification[]> {
    return Notification.insertMany(notifications);
  }

  async deleteOne(
    query: Partial<FindNotificationsQuery>
  ): Promise<{ deletedCount: number }> {
    const result = await Notification.deleteOne(query);
    return { deletedCount: result.deletedCount };
  }

  async deleteMany(
    query: Partial<FindNotificationsQuery>
  ): Promise<{ deletedCount: number }> {
    const result = await Notification.deleteMany(query);
    return { deletedCount: result.deletedCount };
  }

  async aggregateUnreadForDailyDigest(
    since: Date
  ): Promise<DailyDigestAggregateResult[]> {
    return Notification.aggregate([
      {
        $match: {
          isRead: false,
          type: { $ne: NotificationType.DAILY_DIGEST },
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$recipientId',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 0 },
        },
      },
    ]);
  }

  async findDuplicateInWindow(
    recipientId: mongoose.Types.ObjectId,
    type: NotificationType,
    since: Date,
    groupingKey?: { postId?: mongoose.Types.ObjectId; commentId?: mongoose.Types.ObjectId }
  ): Promise<INotification | null> {
    const query: any = {
      recipientId,
      type,
      isRead: false,
      createdAt: { $gte: since },
    };

    if (groupingKey?.postId) {
      query.postId = groupingKey.postId;
    }

    if (groupingKey?.commentId) {
      query.commentId = groupingKey.commentId;
    }

    return Notification.findOne(query).lean();
  }
}

// Export singleton instance
export default new NotificationRepository();
