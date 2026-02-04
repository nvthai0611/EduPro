import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

export const notificationKeys = {
  all: ['notifications'],
  lists: () => [...notificationKeys.all, 'list'],
  list: (filters) => [...notificationKeys.lists(), filters],
  unreadCount: () => [...notificationKeys.all, 'unread-count'],
};

export const useNotifications = (params = {}, options = {}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () => {
      const res = await notificationService.getNotifications(params);
      return res?.data?.data || res?.data || res;
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: 20000, // Refetch every 20 seconds when dropdown is open
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useUnreadCount = (options = {}) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const res = await notificationService.getUnreadCount();
      // Handle both res.data.data.count and res.data.count
      const count = res?.data?.data?.count ?? res?.data?.count ?? 0;
    //   console.log('[useUnreadCount] Response:', res?.data, 'Parsed count:', count);
      return count;
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: 15000, // Refetch every 15 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
    ...options,
  });
};


export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId) => {
      const res = await notificationService.markAsRead(notificationId);
      return res?.data || res;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications and count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
    onError: (err) => {
      console.error('Error marking notification as read:', err);
      toast.error(
        err?.response?.data?.message || 
        err?.message || 
        'Không thể đánh dấu đã đọc'
      );
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await notificationService.markAllAsRead();
      return res?.data || res;
    },
    onSuccess: (data) => {
      // Invalidate and refetch notifications and count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      
      const count = data?.data?.modifiedCount || 0;
      if (count > 0) {
        toast.success(`Đã đánh dấu ${count} thông báo là đã đọc`);
      }
    },
    onError: (err) => {
      console.error('Error marking all notifications as read:', err);
      toast.error(
        err?.response?.data?.message || 
        err?.message || 
        'Không thể đánh dấu tất cả đã đọc'
      );
    },
  });
};

export const useCreateTestNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload) => {
      const res = await notificationService.createTestNotification(payload);
      return res?.data || res;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications and count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      toast.success('Test notification created');
    },
    onError: (err) => {
      console.error('Error creating test notification:', err);
      toast.error(
        err?.response?.data?.message || 
        err?.message || 
        'Không thể tạo test notification'
      );
    },
  });
};

export default {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useCreateTestNotification,
};
