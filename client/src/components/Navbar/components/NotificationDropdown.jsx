import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Loader2, Trash2, X, Filter } from "lucide-react";
import { 
  useNotifications, 
  useUnreadCount, 
  useMarkAsRead, 
  useMarkAllAsRead,
  useDeleteNotification,
  useClearReadNotifications 
} from "../../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const [hoveredId, setHoveredId] = useState(null);
  const menuRef = useRef(null);
  const scrollRef = useRef(null);
  const autoMarkTimerRef = useRef(null);

  const LIMIT = 10;

  // Build query params
  const queryParams = {
    limit: LIMIT,
    skip: (page - 1) * LIMIT,
    ...(filter === "unread" && { unread: true }),
  };

  // Fetch notifications and unread count
  const { 
    data: notificationsData, 
    isLoading,
    isFetching 
  } = useNotifications(
    queryParams,
    { enabled: isOpen } // Only fetch when dropdown is open
  );
  
  const { data: unreadCount = 0 } = useUnreadCount();
  
  // Mutations
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: clearReadNotifications, isPending: isClearing } = useClearReadNotifications();

  const notifications = notificationsData?.items || [];
  const totalNotifications = notificationsData?.total || 0;
  const hasMore = page * LIMIT < totalNotifications;

  // Auto-mark as read when dropdown opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Clear existing timer
      if (autoMarkTimerRef.current) {
        clearTimeout(autoMarkTimerRef.current);
      }
      
      // Mark all as read after 1 second
      autoMarkTimerRef.current = setTimeout(() => {
        markAllAsRead();
      }, 1000);
    }

    return () => {
      if (autoMarkTimerRef.current) {
        clearTimeout(autoMarkTimerRef.current);
      }
    };
  }, [isOpen, unreadCount, markAllAsRead]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [filter]);

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

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when scrolled 80% down
    if (scrollPercentage > 0.8 && hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

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
    setIsOpen(false);
  };

  const handleManualMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Prevent notification click
    deleteNotification(notificationId);
  };

  const handleClearRead = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông báo đã đọc?')) {
      clearReadNotifications();
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
        className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors relative"
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2 min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-0 z-50 border border-gray-200 flex flex-col max-h-[32rem]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800 text-base">
              Thông báo {totalNotifications > 0 && `(${totalNotifications})`}
            </h3>
            <div className="flex items-center gap-2">
              {filter === "all" && notifications.length > 0 && (
                <button
                  onClick={handleClearRead}
                  disabled={isClearing}
                  className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
                  title="Xóa tất cả thông báo đã đọc"
                >
                  <Trash2 className="w-3 h-3" />
                  {isClearing ? 'Đang xóa...' : 'Xóa đã đọc'}
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={handleManualMarkAllAsRead}
                  disabled={isMarkingAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 transition-colors"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  {isMarkingAll ? 'Đang xử lý...' : 'Đánh dấu đã đọc'}
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 border-b border-gray-200 flex gap-2 bg-white">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
          
          {/* Notifications List */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: '400px' }}
          >
            {isLoading && page === 1 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                <p className="text-sm">Đang tải...</p>
              </div>
            ) : notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all group ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onMouseEnter={() => setHoveredId(notification._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Delete button - show on hover */}
                        {hoveredId === notification._id && (
                          <button
                            onClick={(e) => handleDeleteNotification(e, notification._id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa thông báo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading more indicator */}
                {isFetching && page > 1 && (
                  <div className="px-4 py-3 text-center">
                    <Loader2 className="w-5 h-5 mx-auto text-blue-500 animate-spin" />
                  </div>
                )}

                {/* End of list message */}
                {!hasMore && notifications.length > 0 && (
                  <div className="px-4 py-3 text-center text-xs text-gray-400">
                    Đã hiển thị tất cả thông báo
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-12 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">
                  {filter === "unread" 
                    ? "Không có thông báo chưa đọc" 
                    : "Không có thông báo nào"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {filter === "unread" 
                    ? "Tất cả thông báo đã được đọc" 
                    : "Bạn sẽ nhận được thông báo ở đây"}
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-1 transition-colors"
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
