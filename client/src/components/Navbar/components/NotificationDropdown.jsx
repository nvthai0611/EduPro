import { useState, useRef, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "../../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fetch notifications and unread count
  const { data: notificationsData, isLoading } = useNotifications(
    { limit: 20 },
    { enabled: isOpen } // Only fetch when dropdown is open
  );
  
  const { data: unreadCount = 0 } = useUnreadCount();
  
  // Mutations
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const notifications = notificationsData?.items || [];
  const totalNotifications = notificationsData?.total || 0;

  // Debug unread count
  // console.log('[NotificationDropdown] unreadCount:', unreadCount, typeof unreadCount);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // TODO: Navigate based on notification type
    // e.g., if POST_COMMENT, navigate to post
    // if COMMENT_REPLY, navigate to comment
    
    setIsOpen(false);
  };

  const handleViewAll = () => {
    // TODO: Navigate to notifications page
    // console.log("View all notifications");
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Format relative time
  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6" />
      </button>
      
      {unreadCount > 0 && (
        <span className="absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
          {unreadCount}
        </span>
      )}

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Thông báo {totalNotifications > 0 && `(${totalNotifications})`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                {isMarkingAll ? 'Đang xử lý...' : 'Đánh dấu tất cả'}
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
              <p>Đang tải...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 ml-2"></span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Không có thông báo nào</p>
            </div>
          )}
          
          <div className="px-4 py-2 border-t border-gray-200">
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
