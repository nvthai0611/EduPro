"use client";

import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { authService } from "../../services/auth/authService";
import { toast } from "react-toastify";
import useNotificationStore from "../../stores/zustand/notificationStore";
import socket from "../../utils/socket"; // Import socket

export default function DashboardHeader() {
  const [theme, setTheme] = useState("light");
  const { notifications, clearNotifications, markAsRead, addNotification } = // Destructure addNotification
    useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [shouldAnimatePop, setShouldAnimatePop] = useState(false);
  const prevUnreadCountRef = useRef(unreadCount);
  const audioRef = useRef(null);

  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }

      setShouldAnimatePop(true);
      const timer = setTimeout(() => {
        setShouldAnimatePop(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // New useEffect for socket connection and listeners
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      // console.log("Admin socket connected in Header:", socket.id);
      socket.emit("joinRoom", { role: "admin" });
    });

    socket.on("admin_new_order", (orderData) => {
      // console.log("🎉 Admin received new order notification in Header:", orderData);

      const newNotification = {
        id: orderData.orderCode || Date.now(),
        type: "new_order",
        title: `🛍️ Đơn hàng mới từ khách: ${orderData.userName}`,
        message: `🧾 Mã đơn: ${orderData.orderCode}`,
        timestamp: new Date().toISOString(),
        orderData: orderData,
      };

      addNotification(newNotification); // Add notification to store
      toast.info(newNotification.title); // Show toast
    });

    return () => {
      socket.off("connect");
      socket.off("admin_new_order");
    };
  }, [addNotification]); // Depend on addNotification from Zustand store

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.replace(import.meta.env.VITE_CLIENT_URL);
        }, 500);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6"
      style={{ zIndex: 1 }}
    >
      <style>
        {`
        @keyframes notification-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.7);
          }
        }
        .animate-notification-pulse {
          animation: notification-pulse 1.5s infinite ease-in-out;
        }

        @keyframes notification-pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(2.5);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-notification-pop {
          animation: notification-pop 0.3s ease-out;
        }
      `}
      </style>
      {/* <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" /> */}

      <SidebarTrigger />

      <div className="flex items-center gap-2 md:ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center
                    rounded-full bg-red-500 text-[10px] text-white px-1 leading-none
                    ${shouldAnimatePop ? "animate-notification-pop" : "animate-notification-pulse"}
                  `}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-96 max-h-[400px] overflow-y-auto shadow-lg"
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-xl font-extrabold text-gray-800 border-b pb-2 mb-2">
              🔔 Thông báo của Admin
            </DropdownMenuLabel>

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-base text-gray-500 text-center">
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map((noti, idx) => {
                const isUnread = !noti.read;
                const notificationTime = new Date(
                  noti.timestamp || Date.now()
                ).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                let notificationContent;
                let toastContent;

                switch (noti.type) {
                  case "new_order":{
                    const orderData = noti.orderData;
                    notificationContent = (
                      <>
                    
                        <div className="flex justify-between items-center w-full">
                          <div
                            className={`text-base font-semibold ${isUnread ? "text-blue-800" : "text-gray-700"
                              }`}
                          >
                            {noti.title}
                          </div>
                          {isUnread && (
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          🧾 Mã đơn:{" "}
                          <span className="font-medium">{orderData?.orderCode || "N/A"}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          👤 Khách hàng:{" "}
                          <span className="font-medium">{orderData?.userName || "N/A"}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          💰 Tổng tiền:{" "}
                          <span className="font-medium">
                            {orderData?.amount?.toLocaleString("vi-VN") || "0"}₫
                          </span>
                        </div>

                      </>
                    );
                    toastContent = `🛍️ Đơn hàng mới từ khách: ${orderData?.userName || 'N/A'}\n🧾 Mã đơn: ${orderData?.orderCode || 'N/A'}`;
                    break;
                  }
                  default:
                    notificationContent = (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <div
                            className={`text-base font-semibold ${isUnread ? "text-blue-800" : "text-gray-700"
                              }`}
                          >
                            {noti.title || "Thông báo chung"}
                          </div>
                          {isUnread && (
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {noti.message || "Không có nội dung."}
                        </div>
                      </>
                    );
                    toastContent = noti.message || "Bạn có một thông báo mới.";
                }

                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!noti.read) markAsRead(idx);

                      toast.info(toastContent, {
                        autoClose: 5000,
                        position: "top-center",
                      });
                    }}
                    className={`relative flex flex-col items-start px-4 py-3 gap-1 cursor-pointer transition-colors duration-200 ease-in-out border-b last:border-b-0
                      ${isUnread ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"
                      }`}
                  >
                    {notificationContent}

                    <div className="text-xs text-gray-400 mt-2 self-end">
                      {notificationTime}
                    </div>
                  </div>
                );
              })
            )}

            <DropdownMenuSeparator className="mt-2" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                clearNotifications();
              }}
              className="text-center justify-center text-red-600 font-semibold cursor-pointer hover:bg-red-50 transition-colors duration-200 py-2"
            >
              🗑️ Xóa tất cả thông báo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}