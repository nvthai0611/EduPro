"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "./Header"
import DashboardSidebar from "./Siderbar"
import DashboardFooter from "./Footer"
import { Outlet } from "react-router-dom"

function Layout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
                <DashboardSidebar />
                <div className="flex flex-col flex-1 w-full">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
                        <Outlet />
                    </main>
                    <DashboardFooter />
                </div>
            </div>
        </SidebarProvider>
    )
}

export default Layout
