import { apiClient } from '../utils/clientAxios';


const getNotifications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.unread !== undefined) {
    queryParams.append('unread', params.unread);
  }
  if (params.limit) {
    queryParams.append('limit', params.limit);
  }
  if (params.skip) {
    queryParams.append('skip', params.skip);
  }

  const queryString = queryParams.toString();
  const url = `/notifications${queryString ? `?${queryString}` : ''}`;
  
  return await apiClient.get(url);
};


const getUnreadCount = async () => {
  return await apiClient.get('/notifications/unread-count');
};


const markAsRead = async (notificationId) => {
  return await apiClient.patch(`/notifications/${notificationId}/read`);
};


const markAllAsRead = async () => {
  return await apiClient.patch('/notifications/read-all');
};


const createTestNotification = async (payload) => {
  return await apiClient.post('/notifications/test', payload);
};

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createTestNotification,
};

export default notificationService;
