import mongoose, { Schema, Document, Model } from 'mongoose';

export enum NotificationType {
  POST_COMMENT = 'POST_COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  DAILY_DIGEST = 'DAILY_DIGEST',
}

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  type: NotificationType;
  postId?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  digestDate?: string; // Format: YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}


const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor ID is required'],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(NotificationType),
        message: '{VALUE} is not a valid notification type',
      },
      required: [true, 'Notification type is required'],
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    digestDate: {
      type: String,
      default: null,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Digest date must be in YYYY-MM-DD format'],
    },
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);

NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ 
  recipientId: 1, 
  type: 1, 
  postId: 1, 
  commentId: 1, 
  isRead: 1, 
  createdAt: -1 
});

NotificationSchema.methods = {
  async markAsRead(): Promise<INotification> {
    this.isRead = true;
    return this.save();
  },
};

NotificationSchema.statics = {
  async findUnreadByUser(userId: mongoose.Types.ObjectId, limit = 20) {
    return this.find({ recipientId: userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actorId', 'fullName image')
      .lean();
  },

  async getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number> {
    return this.countDocuments({ recipientId: userId, isRead: false });
  },

  async markAllAsReadByUser(userId: mongoose.Types.ObjectId) {
    return this.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
  },
};

export interface INotificationModel extends Model<INotification> {
  findUnreadByUser(
    userId: mongoose.Types.ObjectId,
    limit?: number
  ): Promise<INotification[]>;
  getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
  markAllAsReadByUser(userId: mongoose.Types.ObjectId): Promise<any>;
}

/**
 * Export Notification Model
 */
const Notification = mongoose.model<INotification, INotificationModel>(
  'Notification',
  NotificationSchema
);

export default Notification;
