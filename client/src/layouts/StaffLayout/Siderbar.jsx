import {
  Calendar,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  CalendarOff,
  LayoutDashboard,
  CalendarPlus,
  History,
  Scissors,
  User,
  HousePlus,
  QrCode,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { POSITION } from "../../constains/auth";
import { useLocation } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import { toast, ToastContainer } from "react-toastify";

const StaffSidebar = ({ position }) => {
  const [activeMenu, setActiveMenu] = useState("");

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.replace("/courses");
        }, 500);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <ToastContainer />
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="font-semibold text-lg">Staff Portal</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {position === POSITION.MANAGER && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeMenu == "dashboard"}
                      onClick={() => setActiveMenu("dashboard")}
                      tooltip="Dashboard"
                    >
                      <Link to={"/staff/dashboard"}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Services"
                      isActive={activeMenu == "services"}
                      onClick={() => setActiveMenu("services")}
                    >
                      <Link to={"/staff/manager-service"}>
                        <Scissors />
                        <span>Quản lý dịch vụ</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Staffs"
                      isActive={activeMenu == "staffs"}
                      onClick={() => setActiveMenu("staffs")}
                    >
                      <Link to={"/staff/manager-staff"}>
                        <User />
                        <span>Quản lý nhân viên</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeMenu == "booking-day"}
                      onClick={() => setActiveMenu("booking-day")}
                      tooltip="BookingDay"
                    >
                      <Link to={"/staff/manager-booking-day"}>
                        <Calendar />
                        <span>Booking Day</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Products"
                      isActive={activeMenu == "room"}
                      onClick={() => setActiveMenu("room")}
                    >
                      <Link to={"/staff/manager-room"}>
                        <HousePlus />
                        <span>Room Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Working Day"
                      isActive={activeMenu == "working-day"}
                      onClick={() => setActiveMenu("working-day")}
                    >
                      <Link to={"/staff/manager-working-day"}>
                        <Calendar />
                        <span>Quản lý ngày làm việc</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Booking List"
                      isActive={activeMenu == "booking"}
                      onClick={() => setActiveMenu("booking")}
                    >
                      <Link to={"/staff/booking"}>
                        <Clock />
                        <span>Danh sách Booking</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeMenu == "qr-code"}
                      onClick={() => setActiveMenu("qr-code")}
                      tooltip="Generate QR"
                    >
                      <Link to={"/staff/qr-code"}>
                        <QrCode />
                        <span>Tạo QR</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              {position === POSITION.SERVICE_STAFF && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Work Schedule"
                      isActive={activeMenu == "schedule"}
                      onClick={() => setActiveMenu("schedule")}
                    >
                      <Link to={"/staff/schedule"}>
                        <Calendar />
                        <span>Lịch làm việc</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Leave Request"
                      isActive={activeMenu == "leave-request"}
                      onClick={() => setActiveMenu("leave-request")}
                    >
                      <Link to={"/staff/leave-request/create"}>
                        <CalendarPlus />
                        <span>Tạo yêu cầu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Request History"
                      isActive={activeMenu == "leave-request/history"}
                      onClick={() => setActiveMenu("leave-request/history")}
                    >
                      <Link to={"/staff/leave-request/history"}>
                        <History />
                        <span>Lịch sử yêu cầu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="#">
                    <Settings />
                    <span>Cài đặt</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <a href="#">
                    <HelpCircle />
                    <span>Hỗ trợ</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button onClick={handleLogout} className="w-full text-left">
                <LogOut />
                <span>Đăng xuất</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default StaffSidebar;
