"use client";

import {
  Users,
  Settings,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  HelpCircle,
  Ticket,
  Package,
  UserCheck,
  ClipboardCheck,
  Unlock,
  HelpCircleIcon,
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
import { Link } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import { toast, ToastContainer } from "react-toastify";

export default function DashboardSidebar() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); // mặc định active menu dashboard
  return (
    <Sidebar collapsible="icon">
      <ToastContainer />
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="font-semibold text-lg">Admin Portal</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={activeMenu == "dashboard"}
                  onClick={() => setActiveMenu("dashboard")}
                >
                  <Link to={"/dashboard"}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Courses"
                  isActive={activeMenu == "courses"}
                  onClick={() => setActiveMenu("courses")}
                >
                  <Link to={"/manager-courses"}>
                    <Package />
                    <span>Quản lý Khóa học</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Courses"
                  isActive={activeMenu == "approve-courses"}
                  onClick={() => setActiveMenu("approve-courses")}
                >
                  <Link to={"/approve-courses"}>
                    <ClipboardCheck />
                    <span>Xét Duyệt Khóa học</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Users"
                  isActive={activeMenu == "users"}
                  onClick={() => setActiveMenu("users")}
                >
                  <Link to={"/manager-user"}>
                    <Users />
                    <span>Quản lý người dùng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="assign-course"
                  isActive={activeMenu == "assign-course"}
                  onClick={() => setActiveMenu("assign-course")}
                >
                  <Link to={"/assign-course"}>
                    <Unlock />
                    <span>Cấp Khóa Học</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Attendance"
                  isActive={activeMenu == "attendance"}
                  onClick={() => setActiveMenu("attendance")}
                >
                  <Link to={"/attendance"}>
                    <UserCheck />
                    <span>Điểm danh</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Customer-care"
                  isActive={activeMenu == "customer-care"}
                  onClick={() => setActiveMenu("customer-care")}
                >
                  <Link to={"/student-question"}>
                    <HelpCircleIcon />
                    <span>Câu hỏi học viên</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Coupons"
                  isActive={activeMenu == "coupons"}
                  onClick={() => setActiveMenu("coupons")}
                >
                  <Link to={"/manager-coupons"}>
                    <Ticket />
                    <span>Quản lý Coupon</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Messages"
                  isActive={activeMenu == "review"}
                  onClick={() => setActiveMenu("review")}
                >
                  <Link to={"/manager-review"}>
                    <MessageSquare />
                    <span>Quản lý đánh giá</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  isActive={activeMenu == "settings"}
                  onClick={() => setActiveMenu("settings")}
                >
                  <Link to={"/setting"}>
                    <Settings />
                    <span>Cài đặt</span>
                  </Link>
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
              <button
                onClick={async () => {
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
                }}
                className="w-full text-left"
              >
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
