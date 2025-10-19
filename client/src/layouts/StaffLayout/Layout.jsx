"use client";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./Siderbar";
import StaffHeader from "./Header";
import StaffFooter from "./Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getPosition } from "../../services/staff/positionService";
import { useEffect, useState } from "react";
import socketService from "../../utils/socket";
import { ToastContainer } from "react-toastify";
import useNotificationStore from "../../stores/zustand/notificationStore";
import authService from "../../services/auth/authService";
const StaffLayout = () => {
  const [position, setPosition] = useState("");
  const addNotification = useNotificationStore((state) => state.addNotification);
  useEffect(() => {
  // Kết nối socket
  socketService.connect();
  const branchId = authService.getUser()?.branchId;
  const role = "staff"; // hoặc "staff", lấy từ auth
  // Cho client này vào nhóm "staff"
   socketService.emit("joinRoom", { role, branchId });
  console.log("📢 Staff client đã emit joinRoom");
  // Lắng nghe thông báo từ server
  const handleReceive = ({ message, actionKey, booking }) => {
    // 🧠 Lưu vào store để StaffHeader dùng
    addNotification({ message, actionKey, booking, time: new Date() });
  };
  socketService.on("receiveNotification", handleReceive);
  return () => {
    socketService.off("receiveNotification", handleReceive);
    socketService.disconnect(); // nếu là trang riêng biệt
  };
}, []);
  useEffect(() => {
    const fetchPosition = async () => {
      const res = await getPosition();
      setPosition(res.data.position);
    };
    fetchPosition();
  }, []);
  return (
    <>
      <ToastContainer />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <StaffSidebar position={position} />

          {/* Main Content */}
          <div className="flex flex-col flex-1 w-full">
            {/* Header */}
            <StaffHeader />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
              <Outlet />
            </main>

            {/* Footer */}
            <StaffFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default StaffLayout;
