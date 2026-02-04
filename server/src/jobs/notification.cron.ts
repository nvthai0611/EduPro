import cron from 'node-cron';
import notificationService from '../modules/notification/notification.service';

/**
 * Notification Cron Jobs
 * 
 * Handles scheduled tasks for notification system
 * - Daily digest generation at 8:00 AM
 * - Cleanup old notifications (optional)
 */

/**
 * Daily Digest Cron Job
 * 
 * Schedule: Every day at 8:00 AM (Asia/Ho_Chi_Minh timezone)
 * Purpose: Send daily summary notifications to users with unread items
 * 
 * Idempotent: NotificationService checks for existing digests by date
 * Safe to run multiple times - won't create duplicates
 */
export const startDailyDigestCron = (): void => {
  // Run at 8:00 AM every day
  cron.schedule(
    '0 8 * * *',
    async () => {
      const startTime = new Date();
      console.log(`[CRON] Daily digest job started at ${startTime.toISOString()}`);

      try {
        const count = await notificationService.createDailyDigests();
        
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        console.log(
          `[CRON] Daily digest completed successfully. ` +
          `Created ${count} digests in ${duration}ms`
        );
      } catch (error: any) {
        console.error('[CRON] Daily digest failed:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
        
        // Optional: Send alert to monitoring service
        // alertService.notifyCronFailure('daily-digest', error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
      scheduled: true,
    }
  );

  console.log('[CRON] Daily digest job registered (08:00 AM Asia/Ho_Chi_Minh)');
};

/**
 * Cleanup Old Notifications Cron Job (Optional)
 * 
 * Schedule: Every Sunday at 3:00 AM (Asia/Ho_Chi_Minh timezone)
 * Purpose: Delete read notifications older than 90 days
 * 
 * Helps maintain database performance by removing old data
 */
export const startCleanupCron = (): void => {
  // Run at 3:00 AM every Sunday
  cron.schedule(
    '0 3 * * 0',
    async () => {
      const startTime = new Date();
      console.log(`[CRON] Cleanup job started at ${startTime.toISOString()}`);

      try {
        const count = await notificationService.deleteOldNotifications(90);
        
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        console.log(
          `[CRON] Cleanup completed successfully. ` +
          `Deleted ${count} old notifications in ${duration}ms`
        );
      } catch (error: any) {
        console.error('[CRON] Cleanup failed:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
      scheduled: true,
    }
  );

  console.log('[CRON] Cleanup job registered (03:00 AM Sunday Asia/Ho_Chi_Minh)');
};

/**
 * Initialize all notification cron jobs
 * Call this once during server startup
 */
export const initNotificationCrons = (): void => {
  console.log('[CRON] Initializing notification cron jobs...');
  
  startDailyDigestCron();
  startCleanupCron();
  
  console.log('[CRON] All notification cron jobs initialized');
};

/**
 * Stop all cron jobs (for graceful shutdown)
 */
export const stopNotificationCrons = (): void => {
  console.log('[CRON] Stopping notification cron jobs...');
  // node-cron automatically handles cleanup
  console.log('[CRON] Notification cron jobs stopped');
};
